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

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var request = await _context.Requests
            .Include(r => r.User)
            .Include(r => r.Quotes)
            .Include(r => r.OriginCity)
            .Include(r => r.DestinationCity)
            .FirstOrDefaultAsync(r => r.RequestId == id);

        if (request == null)
            return NotFound();

        return Ok(request);
    }

    //GET
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var requests = await _context.Requests
            .Include(r => r.User)
            .Include(r => r.Quotes)
            .ToListAsync();

        return Ok(requests);
    }

    /// <summary>
    /// Atualiza apenas o status de uma requisição.
    /// </summary>
    /// <param name="id">O ID da requisição.</param>
    /// <param name="status">O novo status da requisição.</param>
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateRequestStatus(int id, [FromBody] string status)
    {
        // 1. Valida se o status fornecido é um valor válido do enum RequestStatus
        if (!Enum.TryParse<RequestStatus>(status, ignoreCase: true, out var parsedStatus) ||
            !Enum.IsDefined(typeof(RequestStatus), parsedStatus))
        {
            return BadRequest("O status fornecido é inválido. Valores aceitos: Draft, Pending, Confirmed, Cancelled.");
        }

        // 2. Busca a requisição no banco de dados pelo ID
        var existingRequest = await _context.Requests.FindAsync(id);

        // 3. Se a requisição não for encontrada, retorna 404 Not Found
        if (existingRequest == null)
        {
            return NotFound($"Requisição com o ID {id} não encontrada.");
        }

        // 4. Atualiza o status da requisição
        existingRequest.Status = parsedStatus.ToString();

        // 5. Salva as alterações no banco de dados
        await _context.SaveChangesAsync();

        // 6. Retorna uma resposta de sucesso, sem conteúdo
        return NoContent();
    }

}
