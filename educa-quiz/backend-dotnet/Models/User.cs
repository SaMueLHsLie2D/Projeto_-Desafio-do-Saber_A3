namespace backend_dotnet.Models;

public class User
{
    public int Id { get; set; }

    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }

    public int AvatarId { get; set; }
    public Avatar Avatar { get; set; }

    public int ColorId { get; set; }
    public Color Color { get; set; }
}