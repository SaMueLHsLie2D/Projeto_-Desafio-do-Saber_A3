[ApiController]
[Route("api/color")]
public class ColorController : ControllerBase
{
    private readonly AppDbContext _context;

    public ColorController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_context.Colors.ToList());
    }
}