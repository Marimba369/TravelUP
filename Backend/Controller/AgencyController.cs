using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelUp.Models;
using TravelUp.DTOs;
using TravelUp.Data;

namespace TravelUp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgencyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AgencyController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AgencyDto>> GetById(int id)
        {
            var agency = await _context.Agencies.FindAsync(id);
            if (agency == null)
                return NotFound();

            var dto = new AgencyDto
            {
                AgencyId = agency.AgencyId,
                Name = agency.Name,
                ContactEmail = agency.ContactEmail,
                PhoneNumber = agency.PhoneNumber,
                Quotes = null // ou preencher se quiser
            };

            return Ok(dto);
        }


        // POST api/agency
        [HttpPost]
        public async Task<ActionResult<AgencyDto>> Create([FromBody] AgencyCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var agency = new Agency
            {
                Name = dto.Name,
                ContactEmail = dto.ContactEmail,
                PhoneNumber = dto.PhoneNumber
            };

            _context.Agencies.Add(agency);
            await _context.SaveChangesAsync();

            var agencyDto = new AgencyDto
            {
                AgencyId = agency.AgencyId,
                Name = agency.Name,
                ContactEmail = agency.ContactEmail,
                PhoneNumber = agency.PhoneNumber,
                Quotes = null
            };

            return CreatedAtAction(nameof(GetById), new { id = agency.AgencyId }, agencyDto);
        }

        // PUT api/agency/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AgencyCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var agency = await _context.Agencies.FindAsync(id);
            if (agency == null) return NotFound();

            agency.Name = dto.Name;
            agency.ContactEmail = dto.ContactEmail;
            agency.PhoneNumber = dto.PhoneNumber;

            _context.Agencies.Update(agency);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE api/agency/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var agency = await _context.Agencies.FindAsync(id);
            if (agency == null) return NotFound();

            _context.Agencies.Remove(agency);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        
        /// <summary>
        /// Obtém uma lista de todas as agências.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AgencyDto>>> GetAll()
        {
            var agencies = await _context.Agencies.ToListAsync();

            var dtos = agencies.Select(agency => new AgencyDto
            {
                AgencyId = agency.AgencyId,
                Name = agency.Name,
                ContactEmail = agency.ContactEmail,
                PhoneNumber = agency.PhoneNumber,
                Quotes = null
            }).ToList();

            return Ok(dtos);
        }
    }
}
