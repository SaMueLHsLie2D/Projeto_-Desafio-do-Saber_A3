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
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(AppDbContext context,  TokenService tokenService) : ControllerBase
    {
        public readonly AppDbContext _context = context;
        private readonly TokenService _tokenService = tokenService;

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
                AvatarId = 1, // Definindo um avatar padrão (pode ser alterado posteriormente)
                ColorId = 1
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new {message = "Usuário cadastrado com sucesso!"});
        }

[HttpPost("login")]
public async Task<IActionResult> Login(LoginDto dto)
{
    var user = await _context.Users
        .Include(u => u.Avatar)
        .Include(u => u.Color)
        .FirstOrDefaultAsync(u => u.Email == dto.Email);

    if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
        return Unauthorized("Usuário ou senha inválidos.");

    // ✅ Busca o total de pontos do leaderboard, não de uma tentativa
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
        Score = totalScore  // ✅ score real
    });
}

// ✅ Endpoint novo — GET /api/user/perfil
[Authorize]
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

    return Ok(new
    {
        name = user.Name,
        avatar = avatarUrl,
        color = user.Color?.HexValue ?? "#000000",
        score = leaderboard?.TotalScore ?? 0,
        avatarId = user.AvatarId,
        colorId = user.ColorId
    });
}

[Authorize]
[HttpPut("perfil/avatar")]
public async Task<IActionResult> EquiparAvatar([FromBody] EquiparAvatarDto dto)
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Unauthorized();
    int userId = int.Parse(userIdClaim.Value);
 
    var user = await _context.Users.FindAsync(userId);
    if (user == null) return NotFound();
 
    // Verifica se o avatar existe e se o usuário tem pontos suficientes
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

[Authorize]
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


        
    }
}