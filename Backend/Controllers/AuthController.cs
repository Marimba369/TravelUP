using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelUp.Data;
using TravelUp.DTOs;
using TravelUp.Service;
using Microsoft.EntityFrameworkCore;

namespace TravelUp.Controllers
{

    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _service;
        public AuthController(AppDbContext context, AuthService service)
        {
            _context = context;
            _service = service;
        }

        [HttpPost("api/authorization/token")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTokenAsync([FromBody] GetTokensRequest request)
        {
            var user = await _context.Users.Where(o => o.Username == request.UserName).FirstAsync();

            if (user == null)
                return Unauthorized(); // 401 or 404
            var passwordValid = user.CheckPasswordAsync(request.Password);

            if (!passwordValid)
                return Unauthorized(); // 401 or 400
            return Ok(_service.Create(user));
        }
    }
}