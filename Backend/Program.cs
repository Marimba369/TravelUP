using Microsoft.EntityFrameworkCore;
using TravelUp.Data;
using TravelUp.Models;
using TravelUp.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

builder.Services.AddTransient<AuthService>();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    var key = builder.Configuration.GetValue<string>("PrivateKey");
    options.TokenValidationParameters = new TokenValidationParameters
    {
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
        ValidateIssuer = false,
        ValidateAudience = false,
    };
});


// needed later for react to be able to call backend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5174", "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddScoped<DataSeederService>();
builder.Services.AddScoped<ProjectImportService>();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

// Execute o serviço de importação na inicialização
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DataSeederService>();
    await seeder.SeedDataAsync();
}

app.UseCors();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
using (var db = scope.ServiceProvider.GetRequiredService<AppDbContext>())
{
    if (!db.Users.Where(o => o.Username == "trish.voyager@example.com").Select(o => o).Any())
    {
        Users user = new()
        {
            Username = "trish.voyager@example.com",
            Name = "Trish Voyager",
            Role = "Traveler",
        };
        user.PasswordHash = user.GeneratePassHash("Password1!");
        db.Users.Add(user);
        user = new()
        {
            Username = "frank.helper@example.com",
            Name = "Frank Helper",
            Role = "Facilitator",
        };
        user.PasswordHash = user.GeneratePassHash("Password1!");
        db.Users.Add(user);
        user = new()
        {
            Username = "mary.decisor@example.com",
            Name = "Mary Decisor",
            Role = "Manager",
        };
        user.PasswordHash = user.GeneratePassHash("Password1!");
        db.Users.Add(user);
        await db.SaveChangesAsync();
    }
}


app.Run();