using System.Security.Claims;
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
        [HttpGet("colors/user/me")]
        public IActionResult GetMyColors()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("Usuário não autenticado.");
            int userId = int.Parse(userIdClaim.Value);

            var leaderboard = _context.Leaderboards.FirstOrDefault(l => l.UserId == userId);
            int totalScore = leaderboard?.TotalScore ?? 0;

            var colors = _context.Colors.Select(c => new
            {
                c.Id,
                c.Name,
                c.HexValue,
                c.RequiredValue,
                IsUnlocked = totalScore >= c.RequiredValue
            }).ToList();

            return Ok(colors);
        }
    }
}
