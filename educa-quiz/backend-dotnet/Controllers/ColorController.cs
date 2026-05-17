using backend_dotnet.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace backend_dotnet.Controllers
{

        [ApiController]
        [Route("api/[controller]")]

        public class ColorController(AppDbContext context) : ControllerBase
        {
            private readonly AppDbContext _context = context;


            [Authorize]
            [HttpGet("colors/user/{userId}")]
            public IActionResult GetColorsUser(int userId)
            {
                
                var user = _context.Users.FirstOrDefault(u => u.Id == userId);
                if (user == null) return NotFound("Usuário não encontrado.");

                var leaderboard = _context.Leaderboards.FirstOrDefault(l => l.UserId == userId);
                if (leaderboard == null) return NotFound("Leaderboard não encontrado para o usuário.");

                int totalscore = leaderboard.TotalScore;


                var colors = _context.Colors.Select(c => new { c.Id, c.Name, c.HexValue, c.RequiredValue, IsUnlocked = totalscore >= c.RequiredValue }).ToList();
                return Ok(colors);
            }
        }

        
    
}