[ApiController]
[Route("api/avatar")]
public class AvatarController : ControllerBase
{
    private readonly AppDbContext _context;

    public AvatarController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_context.Avatars.ToList());
    }
}