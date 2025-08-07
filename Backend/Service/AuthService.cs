using TravelUp.Models;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace TravelUp.Service
{
    public class AuthService
    {
        private readonly IConfiguration _configuration;
        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string Create(Users user)
        {
            var handler = new JwtSecurityTokenHandler();

            var privateKey = Encoding.UTF8.GetBytes(_configuration.GetValue<string>("PrivateKey"));
            var credentials = new SigningCredentials( new SymmetricSecurityKey(privateKey), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                SigningCredentials = credentials,
                Expires = DateTime.UtcNow.AddHours(1),
                Subject = GenerateClaims(user)
            };

            var token = handler.CreateToken(tokenDescriptor);
            return handler.WriteToken(token);
        }

        private static ClaimsIdentity GenerateClaims(Users user)
        {
            var ci = new ClaimsIdentity();

            ci.AddClaim(new Claim("id", user.UserId.ToString()));
            ci.AddClaim(new Claim(ClaimTypes.Email, user.Username));
            ci.AddClaim(new Claim(ClaimTypes.GivenName, user.Name));
            ci.AddClaim(new Claim(ClaimTypes.Role, user.Role));
            
            return ci;
        }
    }
}