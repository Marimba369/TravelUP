using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelUp.Data;
using TravelUp.Models;
using TravelUp.DTOs;
using TravelUp.Models.Enum;

namespace TravelUp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Users>>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            return user;
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<Users>> CreateUser(UserCreateDto dto)
        {
            if ( !Enum.TryParse<Role>(dto.Role, ignoreCase: true, out var parsedRole) ||
                !Enum.IsDefined(typeof(Role), parsedRole) )
            {
                return BadRequest("Invalid role provided.");
            }

            var user = new Users
            {
                Name = dto.Name,
                Email = dto.Email,
                Role = parsedRole
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, user);
        }

        // PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserCreateDto dto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            if (!Enum.TryParse<Role>(dto.Role, true, out var parsedRole))
            {
                return BadRequest("Invalid role.");
            }

            user.Name = dto.Name;
            user.Email = dto.Email;
            user.Role = parsedRole;

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
