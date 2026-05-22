using backend_dotnet.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class RankingController : ControllerBase
{
    private readonly AppDbContext _context;

    public RankingController(AppDbContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetRanking()
    {
        var allUsers = await _context.Leaderboards
            .Include(l => l.User)
                .ThenInclude(u => u.Avatar) // garante que o Avatar é carregado
            .OrderByDescending(l => l.TotalScore)
            .Select(l => new
            {
                l.UserId,
                Name     = l.User.Name,
                // Troque "ImageUrl" pelo nome real da propriedade de URL no seu model Avatar
                // Opções comuns: ImageUrl, Url, Path, FilePath, AvatarUrl
                Avatar   = l.User.Avatar != null ? l.User.Avatar.ImageUrl : null,
                TotalScore = l.TotalScore
            })
            .ToListAsync();

        var ranked = allUsers
            .Select((u, index) => new
            {
                Position   = index + 1,
                u.UserId,
                u.Name,
                u.Avatar,
                u.TotalScore
            })
            .ToList();

        var top5 = ranked.Take(5).ToList();

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        object? currentUser = null;

        if (userIdClaim != null)
        {
            int userId = int.Parse(userIdClaim.Value);
            var me = ranked.FirstOrDefault(r => r.UserId == userId);
            if (me != null)
            {
                currentUser = new
                {
                    me.Position,
                    me.Name,
                    me.Avatar,
                    me.TotalScore
                };
            }
        }

        return Ok(new
        {
            top5 = top5.Select(u => new
            {
                u.Position,
                u.Name,
                u.Avatar,
                u.TotalScore
            }),
            currentUser
        });
    }
}