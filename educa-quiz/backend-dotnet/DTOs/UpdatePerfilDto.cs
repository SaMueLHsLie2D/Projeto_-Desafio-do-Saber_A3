namespace backend_dotnet.DTOs
{
    public class UpdatePerfilDto
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? CurrentPassword { get; set; }  // senha atual (obrigatória se mudar senha)
        public string? Password { get; set; }          // nova senha
    }
}
 