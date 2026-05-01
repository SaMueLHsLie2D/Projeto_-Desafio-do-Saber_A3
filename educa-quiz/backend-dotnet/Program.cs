using backend_dotnet.Data;
using Microsoft.EntityFrameworkCore;
using backend_dotnet.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 34))
    )
);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// libera acesso do React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddScoped<AvatarSeedService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<AvatarSeedService>();
    seeder.SeedAvatars();
}

app.UseCors("AllowAll");

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.UseStaticFiles();
app.Run();