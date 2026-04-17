// Models/User.cs
// Modelo de usuário
// Propriedades:
// - Id: Identificador único do usuário
// - Name: Nome do usuário (obrigatório)
// - ProfileImage: Caminho relativo da imagem de perfil (opcional)
// - BackgroundImage: Caminho relativo da imagem de fundo (opcional)

namespace backend_dotnet.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        public string? ProfileImage { get; set; }
        public string? BackgroundImage { get; set; }
    }
}