using Microsoft.AspNetCore.Mvc;
using backend_dotnet.Data;
using backend_dotnet.Models;

// Controlador para upload de imagens de perfil
// Rota: POST /api/upload/profile/{userId}
// Recebe um arquivo e o ID do usuário, salva a imagem e atualiza o caminho no banco de dados
// Exemplo de uso:
// curl -X POST -F "file=@/caminho/para/imagem.jpg" http://localhost:5000/api/upload/profile/1

namespace backend_dotnet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly AppDbContext _context;

        public UploadController(IWebHostEnvironment env, AppDbContext context)
        {
            _env = env;
            _context = context;
        }

        [HttpPost("profile/{userId}")]
        public async Task<IActionResult> UploadProfile(int userId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Arquivo inválido");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("Usuário não encontrado");

            var folder = Path.Combine(_env.WebRootPath, "uploads", "profile");

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(folder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativePath = $"/uploads/profile/{fileName}";
            user.ProfileImage = relativePath;

            await _context.SaveChangesAsync();

            return Ok(new { path = relativePath });
        }
    }
}