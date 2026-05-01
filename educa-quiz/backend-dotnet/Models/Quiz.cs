namespace backend_dotnet.Models;

public class Quiz
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    //  JSON armazenado como string
    public string Questions { get; set; }
    public DateTime CreatedAt { get; set; }
}