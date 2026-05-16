using backend_dotnet.Data;
using Microsoft.AspNetCore.Mvc;

namespace backend_dotnet.Controllers
{
   

        [ApiController]
        [Route("api/[controller]")]

        public class AvatarController(AppDbContext context) : ControllerBase
        {
            private readonly AppDbContext _context = context;

            [HttpGet("avatars/user/{userId}")]
            public IActionResult GetAvatarsUser(int userId)
            {
                
                var user = _context.Users.FirstOrDefault(u => u.Id == userId);
                if (user == null) return NotFound("Usuário não encontrado.");

                var leaderboard = _context.LeaderBoards.FirstOrDefault(l => l.UserId == userId);
                if (leaderboard == null) return NotFound("Leaderboard não encontrado para o usuário.");

                int totalscore = leaderboard.TotalScore;

                var avatars = _context.Avatars.Select(a => new { a.Id, a.Name, a.ImageUrl, a.RequiredValue, IsUnlocked = totalscore >= a.RequiredValue }).ToList();
                return Ok(avatars);
        
            }
        }
}