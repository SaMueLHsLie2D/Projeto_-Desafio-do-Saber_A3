using Microsoft.AspNetCore.Mvc;
using backend_dotnet.Data;
using backend_dotnet.Models;
using backend_dotnet.DTOs;
using System.Text.Json;
using SeuProjeto.Models;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("api/quiz")]
public class QuizController : ControllerBase
{
    private readonly AppDbContext _context;

    public QuizController(AppDbContext context)
    {
        _context = context;
    }

    // LISTAR TODOS
    [HttpGet]
    public IActionResult GetAll()
    {
        var quizzes = _context.Quizzes.ToList();
        return Ok(quizzes);
    }

    [HttpGet("quiz/{title}/{description}")]
    public IActionResult GetRandomQuestions(string title, string description, int count = 5)
    {
        var quiz = _context.Quizzes.FirstOrDefault(q => q.Title == title && q.Description == description);

        if (quiz == null)
        {
            return NotFound("Quiz não encontrado.");
        }

        // Converte a string JSON de volta para uma lista de perguntas
        var questions = JsonSerializer.Deserialize<List<QuestionDto>>(quiz.Questions);

        if (questions == null || questions.Count == 0)
        {
            return NotFound("Nenhuma pergunta encontrada para este quiz.");
        }

        var random = new Random();
        var randomQuestions = questions.OrderBy(q => random.Next()).Take(count).ToList();

        return Ok(randomQuestions);

       
    }



    // CRIAR QUIZ
    [HttpPost]
    public IActionResult Create(CreateQuizDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
     

        var quiz = new Quiz
        {
            Title = dto.Title,
            Description = dto.Description,
            Questions = JsonSerializer.Serialize(dto.Questions),
            CreatedAt = DateTime.Now
        };

        _context.Quizzes.Add(quiz);
        _context.SaveChanges();

        return Ok(quiz);
    }
}