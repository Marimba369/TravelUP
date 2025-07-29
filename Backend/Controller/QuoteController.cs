using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelUp.Data;
using TravelUp.DTOs;
using TravelUp.Models;

namespace TravelUp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuoteController : ControllerBase
{
    private readonly AppDbContext _context;

    public QuoteController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Quote
    [HttpGet]
    public async Task<ActionResult<IEnumerable<QuoteDto>>> GetQuotes()
    {
        return await _context.Quotes
            .Include(q => q.Agency)
            .Select(q => new QuoteDto
            {
                QuoteId = q.QuoteId,
                HotelName = q.HotelName,
                FlightName = q.FlightName,
                Cost = q.Cost,
                RequestId = q.RequestId,
                AgencyId = q.AgencyId,
                AgencyName = q.Agency != null ? q.Agency.Name : null,
                CheckInDate = q.CheckInDate,
                CheckOutDate = q.CheckOutDate
            }).ToListAsync();
    }

    // GET: api/Quote/5
    [HttpGet("{id}")]
    public async Task<ActionResult<QuoteDto>> GetQuote(int id)
    {
        var quote = await _context.Quotes
            .Include(q => q.Agency)
            .FirstOrDefaultAsync(q => q.QuoteId == id);

        if (quote == null)
            return NotFound();

        return new QuoteDto
        {
            QuoteId = quote.QuoteId,
            HotelName = quote.HotelName,
            FlightName = quote.FlightName,
            Cost = quote.Cost,
            RequestId = quote.RequestId,
            AgencyId = quote.AgencyId,
            AgencyName = quote.Agency?.Name,
            CheckInDate = quote.CheckInDate,
            CheckOutDate = quote.CheckOutDate
        };
    }

    // POST: api/Quote
    [HttpPost]
    public async Task<ActionResult<QuoteDto>> PostQuote(QuoteDto dto)
    {
        var quote = new Quote
        {
            HotelName = dto.HotelName,
            FlightName = dto.FlightName,
            Cost = dto.Cost,
            RequestId = dto.RequestId,
            AgencyId = dto.AgencyId,
            CheckInDate = dto.CheckInDate,
            CheckOutDate = dto.CheckOutDate
        };

        _context.Quotes.Add(quote);
        await _context.SaveChangesAsync();

        dto.QuoteId = quote.QuoteId;

        return CreatedAtAction(nameof(GetQuote), new { id = quote.QuoteId }, dto);
    }

    // PUT: api/Quote/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutQuote(int id, QuoteDto dto)
    {
        if (id != dto.QuoteId)
            return BadRequest();

        var quote = await _context.Quotes.FindAsync(id);
        if (quote == null)
            return NotFound();

        quote.HotelName = dto.HotelName;
        quote.FlightName = dto.FlightName;
        quote.Cost = dto.Cost;
        quote.RequestId = dto.RequestId;
        quote.AgencyId = dto.AgencyId;
        quote.CheckInDate = dto.CheckInDate;
        quote.CheckOutDate = dto.CheckOutDate;

        _context.Entry(quote).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Quote/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuote(int id)
    {
        var quote = await _context.Quotes.FindAsync(id);
        if (quote == null)
            return NotFound();

        _context.Quotes.Remove(quote);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
