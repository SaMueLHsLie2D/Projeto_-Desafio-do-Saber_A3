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
namespace backend_dotnet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(AppDbContext context, IConfiguration configuration) : ControllerBase
    {
        public readonly AppDbContext _context = context;
        private readonly IConfiguration _configuration = configuration;

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
                AvatarId = dto.AvatarId,
                ColorId = dto.ColorId
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new {message = "Usuário cadastrado com sucesso!"});
        }

        [HttpPost("login")]

        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
               return Unauthorized("Usuário ou senha inválidos.");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
                
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            string jwt = tokenHandler.WriteToken(token);

            return Ok(new {token = jwt });


        }
     

        
    }
}