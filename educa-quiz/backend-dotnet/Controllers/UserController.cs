using backend_dotnet.Data;
using backend_dotnet.Dtos;
using backend_dotnet.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using backend_dotnet.DTOs;
using backend_dotnet.Services;

namespace backend_dotnet.Controllers
{
    [Authorize]                          // ← protege todos os endpoints por padrão
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(AppDbContext context, TokenService tokenService) : ControllerBase
    {
        public readonly AppDbContext _context = context;
        private readonly TokenService _tokenService = tokenService;

        [AllowAnonymous]                 // ← exceção: rota pública
        [HttpPost("Cadastro")]
        public async Task<IActionResult> Cadastro(CadastroDto dto)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (existingUser != null)
            {
                return BadRequest("Email já cadastrado.");
            }

            string senhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = senhaHash,
                AvatarId = 1,
                ColorId = 1
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuário cadastrado com sucesso!" });
        }

        [AllowAnonymous]                 // ← exceção: rota pública
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Avatar)
                .Include(u => u.Color)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                return Unauthorized("Usuário ou senha inválidos.");

            var leaderboard = await _context.Leaderboards.FirstOrDefaultAsync(l => l.UserId == user.Id);
            var totalScore = leaderboard?.TotalScore ?? 0;

            var jwt = _tokenService.GenerateToken(user);

            var avatarUrl = user.Avatar != null
                ? $"{Request.Scheme}://{Request.Host}{user.Avatar.ImageUrl}"
                : "";

            return Ok(new LoginResponseDto
            {
                Token = jwt,
                Name = user.Name,
                Avatar = avatarUrl,
                Color = user.Color?.HexValue ?? "#000000",
                Score = totalScore
            });
        }

        [HttpGet("perfil")]
        public async Task<IActionResult> GetPerfil()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim.Value);

            var user = await _context.Users
                .Include(u => u.Avatar)
                .Include(u => u.Color)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound();

            var leaderboard = await _context.Leaderboards
                .FirstOrDefaultAsync(l => l.UserId == userId);

            var avatarUrl = user.Avatar != null
                ? $"{Request.Scheme}://{Request.Host}{user.Avatar.ImageUrl}"
                : "";

            int totalScore = leaderboard?.TotalScore ?? 0;
            int unlockedAvatars = await _context.Avatars
                .CountAsync(a => a.RequiredValue <= totalScore);
            int unlockedBackgrounds = await _context.Colors
                .CountAsync(c => c.RequiredValue <= totalScore);

            return Ok(new
            {
                name = user.Name,
                email = user.Email,
                avatar = avatarUrl,
                color = user.Color?.HexValue ?? "#000000",
                score = totalScore,
                avatarId = user.AvatarId,
                colorId = user.ColorId,
                unlockedAvatars,
                unlockedBackgrounds
            });
        }

        [HttpPut("perfil/avatar")]
        public async Task<IActionResult> EquiparAvatar([FromBody] EquiparAvatarDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim.Value);

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            var avatar = await _context.Avatars.FindAsync(dto.AvatarId);
            if (avatar == null) return NotFound("Avatar não encontrado.");

            var leaderboard = await _context.Leaderboards.FirstOrDefaultAsync(l => l.UserId == userId);
            int totalScore = leaderboard?.TotalScore ?? 0;

            if (totalScore < avatar.RequiredValue)
                return BadRequest($"Você precisa de {avatar.RequiredValue} pontos para desbloquear este avatar.");

            user.AvatarId = dto.AvatarId;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Avatar equipado com sucesso!" });
        }

        [HttpPut("perfil/color")]
        public async Task<IActionResult> EquiparColor([FromBody] EquiparColorDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim.Value);

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            var color = await _context.Colors.FindAsync(dto.ColorId);
            if (color == null) return NotFound("Cor não encontrada.");

            var leaderboard = await _context.Leaderboards.FirstOrDefaultAsync(l => l.UserId == userId);
            int totalScore = leaderboard?.TotalScore ?? 0;

            if (totalScore < color.RequiredValue)
                return BadRequest($"Você precisa de {color.RequiredValue} pontos para desbloquear esta cor.");

            user.ColorId = dto.ColorId;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cor equipada com sucesso!" });
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetUserStats()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim.Value);

            var attempts = await _context.Attempts
                .Where(a => a.UserId == userId)
                .ToListAsync();

            int quizzesPlayed = attempts.Count;
            int totalScore = attempts.Sum(a => a.Score ?? 0);
            double avgScore = quizzesPlayed > 0
                ? Math.Round((double)totalScore / quizzesPlayed, 1)
                : 0;

            return Ok(new
            {
                quizzesPlayed,
                totalScore,
                avgScore
            });
        }

        [HttpGet("proxima-conquista")]
        public async Task<IActionResult> GetNextUnlock()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim.Value);

            var leaderboard = await _context.Leaderboards
               .FirstOrDefaultAsync(l => l.UserId == userId);
            int totalScore = leaderboard?.TotalScore ?? 0;

            var nextAvatars = await _context.Avatars
                .Where(a => a.RequiredValue > totalScore)
                .OrderBy(a => a.RequiredValue)
                .Select(a => new {
                    type = "avatar",
                    name = a.Name,
                    requiredValue = a.RequiredValue,
                    currentScore = totalScore
                })
                .ToListAsync();

            var nextColors = await _context.Colors
                .Where(c => c.RequiredValue > totalScore)
                .OrderBy(c => c.RequiredValue)
                .Select(c => new {
                    type = "color",
                    name = c.Name,
                    requiredValue = c.RequiredValue,
                    currentScore = totalScore
                })
                .ToListAsync();

            var allNext = nextAvatars.Cast<dynamic>().Concat(nextColors.Cast<dynamic>())
                .OrderBy(x => x.requiredValue)
                .FirstOrDefault();

            if (allNext == null)
            {
                return Ok(new
                {
                    type = "complete",
                    message = "Você desbloqueou todas as personalizações!",
                    currentScore = totalScore,
                    targetScore = totalScore
                });
            }

            return Ok(new
            {
                type = allNext.type,
                name = allNext.name,
                currentScore = allNext.currentScore,
                targetScore = allNext.requiredValue,
                pointsNeeded = allNext.requiredValue - allNext.currentScore
            });
        }

        [HttpPut("perfil")]
        public async Task<IActionResult> UpdatePerfil([FromBody] UpdatePerfilDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim.Value);

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(dto.Name))
                user.Name = dto.Name;

            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                bool emailTaken = await _context.Users
                    .AnyAsync(u => u.Email == dto.Email && u.Id != userId);
                if (emailTaken)
                    return BadRequest(new { message = "Este e-mail já está em uso." });
                user.Email = dto.Email;
            }

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                if (string.IsNullOrWhiteSpace(dto.CurrentPassword))
                    return BadRequest(new { message = "Senha atual é obrigatória para alterar a senha." });

                if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.Password))
                    return BadRequest(new { message = "Senha atual incorreta." });

                user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            user.UpdateAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { name = user.Name, email = user.Email });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "Logout realizado com sucesso." });
        }
    }
}