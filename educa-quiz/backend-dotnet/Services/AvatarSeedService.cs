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

            if (!_context.Avatars.Any(a => a.ImageUrl == imageUrl))
            {
                int requiredValue = 0;
                string name = Path.GetFileNameWithoutExtension(fileName);

                // separa pelo "_" e pega a primeira parte como nome
                var parts = name.Split('_');
                if (parts.Length > 1)
                {
                    name = parts[0]; // texto antes do "_"
                    if (int.TryParse(parts[1], out int value))
                    {
                        requiredValue = value; // número depois do "_"
                    }
                }

                _context.Avatars.Add(new Avatar
                {
                    Name = name,
                    ImageUrl = imageUrl,
                    RequiredValue = requiredValue
                });
            }
        }

        // deleta os avatares que não existem mais na pasta
        var existingAvatars = _context.Avatars.ToList();
        foreach (var avatar in existingAvatars)
        {
            var filePath = Path.Combine(path, Path.GetFileName(avatar.ImageUrl));

            if (!File.Exists(filePath))
            {
                _context.Avatars.Remove(avatar);
            }
        }

        _context.SaveChanges();
    }
}
