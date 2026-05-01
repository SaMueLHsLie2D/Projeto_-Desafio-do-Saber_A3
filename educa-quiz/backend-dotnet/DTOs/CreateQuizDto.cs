namespace backend_dotnet.DTOs;

public class CreateQuizDto
{
    public string Title { get; set; }
    public string Description { get; set; }

    // aqui já vem como objeto
    public object Questions { get; set; }
}