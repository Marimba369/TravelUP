using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelUp.Models;
using TravelUp.DTOs;
using TravelUp.Data;

[ApiController]
[Route("api/[controller]")]
public class RequestsController : ControllerBase
{
    private readonly AppDbContext _context;

    public RequestsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/requests
    [HttpGet]
    public async Task<ActionResult<List<RequestDto>>> GetRequests()
    {
        var requests = await _context.Requests
            .Include(r => r.Quotes)
            .Select(r => new RequestDto
            {
                RequestId = r.RequestId,
                Code = r.Code,
                Description = r.Description,
                Status = r.Status,
                TravelDate = r.TravelDate!.Value,
                ReturnDate = r.ReturnDate!.Value,
                IsRoundTrip = r.IsRoundTrip,
                NeedHotel = r.NeedHotel,
                UserId = r.UserId,
                Quotes = r.Quotes!.Select(q => new QuoteDto
                {
                    QuoteId = q.QuoteId,
                    HotelName = q.HotelName,
                    FlightName = q.FlightName,
                    Cost = q.Cost,
                    AgencyId = q.AgencyId,
                    CheckInDate = q.CheckInDate,
                    CheckOutDate = q.CheckOutDate
                }).ToList()
            })
            .ToListAsync();

        return Ok(requests);
    }

    // POST: api/requests
    [HttpPost]
    public async Task<ActionResult<RequestDto>> CreateRequest(RequestCreateDto dto)
    {
        var request = new Request
        {
            Code = dto.Code,
            Description = dto.Description,
            Status = dto.Status,
            TravelDate = dto.TravelDate,
            ReturnDate = dto.ReturnDate,
            IsRoundTrip = dto.IsRoundTrip,
            NeedHotel = dto.NeedHotel,
            UserId = dto.UserId
        };

        _context.Requests.Add(request);
        await _context.SaveChangesAsync();

        // Montar DTO de resposta
        var responseDto = new RequestDto
        {
            RequestId = request.RequestId,
            Code = request.Code,
            Description = request.Description,
            Status = request.Status,
            TravelDate = request.TravelDate!.Value,
            ReturnDate = request.ReturnDate!.Value,
            IsRoundTrip = request.IsRoundTrip,
            NeedHotel = request.NeedHotel,
            UserId = request.UserId,
            Quotes = new List<QuoteDto>() // vazio no momento da criação
        };

        return CreatedAtAction(nameof(GetRequests), new { id = responseDto.RequestId }, responseDto);
    }
}
