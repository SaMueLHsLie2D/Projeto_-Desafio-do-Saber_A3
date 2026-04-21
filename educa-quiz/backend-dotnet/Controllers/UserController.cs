using backend_dotnet.Data;
using backend_dotnet.Dtos;
using backend_dotnet.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
namespace backend_dotnet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(AppDbContext context) : ControllerBase
    {
        public readonly AppDbContext _context = context;

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
     

        
    }
}