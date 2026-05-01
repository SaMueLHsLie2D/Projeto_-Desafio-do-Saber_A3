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

            // evita duplicar no banco
            if (!_context.Avatars.Any(a => a.ImageUrl == imageUrl))
            {
                _context.Avatars.Add(new Avatar
                {
                    Name = fileName,
                    ImageUrl = imageUrl
                });
            }
        }

        _context.SaveChanges();
    }
}