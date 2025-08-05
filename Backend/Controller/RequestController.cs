using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelUp.Data;
using TravelUp.DTOs;
using TravelUp.Models;
using TravelUp.Models.Enum;

namespace TravelUp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RequestController : ControllerBase
{
    private readonly AppDbContext _context;

    public RequestController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateRequest([FromBody] CreateRequestDto dto)
    {
        if (!Enum.TryParse<RequestStatus>(dto.Status, ignoreCase: true, out var parseStatus) ||
                !Enum.IsDefined(typeof(RequestStatus), parseStatus))
        {
            return BadRequest("Invalid Status request provided!");
        }
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }


        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var request = new Request
        {
            Description = dto.Description,
            Status = dto.Status,
            TravelDate = dto.TravelDate,
            ReturnDate = (dto.IsRoundTrip == false) ? DateTime.MinValue : dto.ReturnDate, //returnDate === '0001-01-01T00:00:00'
            IsRoundTrip = dto.IsRoundTrip,
            NeedHotel = dto.NeedHotel,
            UserId = dto.UserId,
            OriginCityId = dto.OriginCityId,
            DestinationCityId = dto.DestinationCityId,
        };

        _context.Requests.Add(request);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = request.RequestId }, request);
    }

    // Controllers/RequestController.cs

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var request = await _context.Requests
            .Include(r => r.User)
            .Include(r => r.Quotes)
            .Include(r => r.OriginCity) // Inclua a cidade de origem
            .Include(r => r.DestinationCity) // Inclua a cidade de destino
            .FirstOrDefaultAsync(r => r.RequestId == id);

        if (request == null)
            return NotFound();

        // Mapeie o objeto Request para o DTO
        var requestDto = new RequestDto
        {
            RequestId = request.RequestId,
            Description = request.Description,
            Status = request.Status,
            TravelDate = request.TravelDate,
            ReturnDate = request.ReturnDate,
            IsRoundTrip = request.IsRoundTrip,
            NeedHotel = request.NeedHotel,
            OriginCityName = request.OriginCity.Name, // Use o nome aqui
            DestinationCityName = request.DestinationCity.Name, // E aqui
            UserId = request.UserId
            // Copie as quotes se necessário ou crie um DTO para elas também
        };

        return Ok(requestDto);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var requests = await _context.Requests
            .Include(r => r.User)
            .Include(r => r.Quotes)
            .Include(r => r.OriginCity)
            .Include(r => r.DestinationCity)
            .ToListAsync();

        // Mapeie a lista de Requests para uma lista de RequestDto
        var requestsDto = requests.Select(r => new RequestDto
        {
            RequestId = r.RequestId,
            Description = r.Description,
            Status = r.Status,
            TravelDate = r.TravelDate,
            ReturnDate = r.ReturnDate,
            IsRoundTrip = r.IsRoundTrip,
            NeedHotel = r.NeedHotel,
            OriginCityName = r.OriginCity.Name,
            DestinationCityName = r.DestinationCity.Name,
            UserId = r.UserId
        }).ToList();

        return Ok(requestsDto);
    }



}
