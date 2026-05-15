using backend_dotnet.Data;
using backend_dotnet.Models;

namespace backend_dotnet.Services;

public class AvatarSeedService
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public AvatarSeedService(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    public void SeedAvatars()
    {
        var path = Path.Combine(_env.WebRootPath, "avatars");

        if (!Directory.Exists(path))
            return;

        var files = Directory.GetFiles(path);

        foreach (var file in files)
        {
            var fileName = Path.GetFileName(file);
            var imageUrl = "/avatars/" + fileName;

            // lógica para extrair o valor necessário do nome do arquivo, por exemplo: avatar_100.png -> requiredValue = 100
            if (!_context.Avatars.Any(a => a.ImageUrl == imageUrl))
            {
                int requiredValue = 0;

                var parts = fileName.Split('_', '.');

                foreach (var part in parts)
                {
                    if (int.TryParse(part, out int value))
                    {
                        requiredValue = value;
                        break;
                    }
                }


                _context.Avatars.Add(new Avatar
                {
                    Name = fileName,
                    ImageUrl = imageUrl,
                    RequiredValue = requiredValue
        
                });
            }
        }

        // deleta os avatrs que nao existem mais na pasta

        var existingAvatars = _context.Avatars.ToList();
        foreach (var avatar in existingAvatars)
        {

            var filePath = Path.Combine(path, Path.GetFileName(avatar.ImageUrl) );

            if (!File.Exists(filePath))
            {
                _context.Avatars.Remove(avatar);
            }
        }


        _context.SaveChanges();
    }
}