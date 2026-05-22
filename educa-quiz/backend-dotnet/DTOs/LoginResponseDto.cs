namespace backend_dotnet.Dtos
{
    public class LoginResponseDto
    {
        public string Token { get; set; }
        public string Name { get; set; }
        public string Avatar { get; set; }
        public string Color { get; set; }
        public int Score { get; set; }
        
    }
}