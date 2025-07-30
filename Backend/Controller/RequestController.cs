using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelUp.Data;
using TravelUp.DTOs;
using TravelUp.Models;

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
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var validationResults = dto.Validate(new ValidationContext(dto));
        foreach (var error in validationResults)
        {
            ModelState.AddModelError(error.MemberNames.FirstOrDefault() ?? "", error.ErrorMessage);
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var request = new Request
        {
            Description = dto.Description,
            Status = Models.Enum.RequestStatus.Pending,
            TravelDate = dto.TravelDate,
            ReturnDate = dto.ReturnDate,
            IsRoundTrip = dto.IsRoundTrip,
            NeedHotel = dto.NeedHotel,
            Origin = dto.Origin,
            Destination = dto.Destination,
            UserId = dto.UserId
        };

        _context.Requests.Add(request);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = request.RequestId }, request);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var request = await _context.Requests
            .Include(r => r.User)
            .Include(r => r.Quotes)
            .FirstOrDefaultAsync(r => r.RequestId == id);

        if (request == null)
            return NotFound();

        return Ok(request);
    }
}
