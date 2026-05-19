using Microsoft.AspNetCore.Mvc;
using backend_dotnet.Data;
using backend_dotnet.Models;
using backend_dotnet.DTOs;
using System.Text.Json;
using SeuProjeto.Models;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

    [HttpGet("{title}/{description}")]
    public IActionResult GetRandomQuestions(string title, string description, int count = 5)
    {
        var quiz = _context.Quizzes.FirstOrDefault(q =>
            q.Title.ToLower() == title.ToLower() &&
            q.Description.ToLower() == description.ToLower());

        if (quiz == null)
        {
            return NotFound("Quiz não encontrado.");
        }

        // Converte a string JSON de volta para uma lista de perguntas
        var questions = JsonSerializer.Deserialize<List<QuestionDto>>(quiz.Questions, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (questions == null || questions.Count == 0)
        {
            return NotFound("Nenhuma pergunta encontrada para este quiz.");
        }

        var random = new Random();
        var randomQuestions = questions.OrderBy(q => random.Next()).Take(count).ToList();

        return Ok(new
        {
            QuizId = quiz.Id,
            Questions = randomQuestions
        });
    }

    [Authorize] // garante que só usuários logados acessam
    [HttpPut("pontos")]
    public async Task<IActionResult> SaveQuizPoints([FromBody] QuizPointsDto dto)
    {
        // Recupera o ID do usuário a partir do token JWT
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null) return Unauthorized();

        int userId = int.Parse(userIdClaim.Value);

        // Agora você usa esse userId em vez de receber pelo body
        var attempt = new Attempt
        {
            UserId = userId,
            QuizId = dto.QuizId,
            Score = dto.Score,
            CompletedAt = DateTime.UtcNow
        };
        _context.Attempts.Add(attempt);

        var leaderboard = await _context.Leaderboards.FirstOrDefaultAsync(l => l.UserId == userId);

        if (leaderboard == null)
        {
            leaderboard = new Leaderboard
            {
                UserId = userId,
                TotalScore = dto.Score
            };
            _context.Leaderboards.Add(leaderboard);
        }
        else
        {
            leaderboard.TotalScore += dto.Score;
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Pontuação salva com sucesso!", totalScore = leaderboard.TotalScore });
    }


        [Authorize]
        [HttpPost("reciclagempontos")]
        public async Task<IActionResult> AddRecyclePoints([FromBody] ScoreRequest request)
        {
            // Valida o request
            if (request == null || request.score < 0)
            {
                return BadRequest(new { message = "Score inválido" });
            }
 
            // Extrai o userId do JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized(new { message = "Usuário não identificado" });
            }
 
            try
            {
                // Busca ou cria o registro do usuário no Leaderboard
                var leaderboard = await _context.Leaderboards
                    .FirstOrDefaultAsync(l => l.UserId == userId);
 
                if (leaderboard == null)
                {
                    // Se não existir, cria um novo
                    leaderboard = new Leaderboard
                    {
                        UserId = userId,
                        TotalScore = request.score
                    };
                    _context.Leaderboards.Add(leaderboard);
                }
                else
                {
                    // Se existir, adiciona os pontos
                    leaderboard.TotalScore += request.score;
                }
 
                await _context.SaveChangesAsync();
 
                return Ok(new
                {
                    message = "Pontos adicionados com sucesso",
                    totalScore = leaderboard.TotalScore,
                    pointsAdded = request.score
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao salvar pontos", error = ex.Message });
            }
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

