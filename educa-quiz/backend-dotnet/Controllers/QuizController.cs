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

    // PEGAR UM
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var quiz = _context.Quizzes.FirstOrDefault(q => q.Id == id);

        if (quiz == null)
            return NotFound();

        // converte JSON antes de enviar
        var parsedQuestions = JsonSerializer.Deserialize<object>(quiz.Questions);

        return Ok(new
        {
            quiz.Id,
            quiz.Title,
            quiz.Description,
            questions = parsedQuestions
        });
    }

    // CRIAR QUIZ
    [HttpPost]
    public IActionResult Create(CreateQuizDto dto)
    {
        var quiz = new Quiz
        {
            Title = dto.Title,
            Description = dto.Description,

            // transforma objeto em string JSON
            Questions = JsonSerializer.Serialize(dto.Questions),
            CreatedAt = DateTime.Now
        };

        _context.Quizzes.Add(quiz);
        _context.SaveChanges();

        return Ok(quiz);
    }
}