using System.Security.Claims;
using backend_dotnet.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_dotnet.Controllers
{
   

        [ApiController]
        [Route("api/[controller]")]

        public class AvatarController(AppDbContext context) : ControllerBase
        {
            private readonly AppDbContext _context = context;


            [Authorize]
            [HttpGet("avatars/user/me")]
            public IActionResult GetMyAvatars()
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized("Usuário não autenticado.");
                int userId = int.Parse(userIdClaim.Value);

                var leaderboard = _context.Leaderboards.FirstOrDefault(l => l.UserId == userId);
                int totalScore = leaderboard?.TotalScore ?? 0;

                var avatars = _context.Avatars.Select(a => new
                {
                    a.Id,
                    a.Name,
                    a.ImageUrl,
                    a.RequiredValue,
                    IsUnlocked = totalScore >= a.RequiredValue
                }).ToList();

                return Ok(avatars);

                

            }
        }
}