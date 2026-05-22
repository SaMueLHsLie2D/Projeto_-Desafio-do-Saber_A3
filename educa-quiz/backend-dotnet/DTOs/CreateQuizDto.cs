namespace backend_dotnet.DTOs;

public class CreateQuizDto
{
    public string Title { get; set; }
    public string Description { get; set; }

    public List<QuestionDto> Questions { get; set; }
}