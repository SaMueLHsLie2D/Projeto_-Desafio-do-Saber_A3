using backend_dotnet.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 4, 8))
    )
);

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "EcoMonitor API v1");
        c.RoutePrefix = string.Empty; // Define o Swagger como pÃ¡gina inicial
    });
}


app.UseSwagger();
app.UseSwaggerUI();

app.UseStaticFiles();

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();