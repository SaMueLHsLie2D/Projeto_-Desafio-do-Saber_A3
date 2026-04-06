using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class QuizController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("Quiz API funcionando");
    }
}
