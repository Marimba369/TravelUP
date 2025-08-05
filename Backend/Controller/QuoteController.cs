using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelUp.Data;
using TravelUp.Models;
using TravelUp.DTOs;

namespace TravelUp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuoteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuoteController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtém todos os orçamentos, incluindo os seus itens de voo e hotel, e os retorna como DTOs.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuoteDto>>> GetQuotes()
        {
            var quotes = await _context.Quotes
                .Include(q => q.Items)
                .ToListAsync();

            var result = quotes.Select(q => ToDto(q)).ToList();

            return Ok(result);
        }

        /// <summary>
        /// Obtém um orçamento específico pelo seu ID e o retorna como DTO.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<QuoteDto>> GetQuote(int id)
        {
            var quote = await _context.Quotes
                .Include(q => q.Items)
                .FirstOrDefaultAsync(q => q.QuoteId == id);

            if (quote == null)
                return NotFound();

            return Ok(ToDto(quote));
        }

        /// <summary>
        /// Cria um novo orçamento com base nos itens de DTO fornecidos.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<QuoteDto>> CreateQuote([FromBody] QuoteCreateDto quoteCreateDto)
        {
            if (!quoteCreateDto.Items.Any())
            {
                return BadRequest("Nenhum item foi fornecido para criar um orçamento.");
            }

            var request = await _context.Requests.FindAsync(quoteCreateDto.RequestId);
            if (request == null)
            {
                return NotFound($"A solicitação com o ID {quoteCreateDto.RequestId} não foi encontrada.");
            }

            var agency = await _context.Agencies.FindAsync(quoteCreateDto.AgencyId);
            if (agency == null)
            {
                return NotFound($"A agência com o ID {quoteCreateDto.AgencyId} não foi encontrada.");
            }

            var quote = new Quote
            {
                RequestId = quoteCreateDto.RequestId,
                AgencyId = quoteCreateDto.AgencyId,
                Items = new List<QuoteItem>()
            };

            foreach (var itemDto in quoteCreateDto.Items)
            {
                if (itemDto.Type.Equals("flight", StringComparison.OrdinalIgnoreCase))
                {
                    quote.Items.Add(new QuoteFlight
                    {
                        FlightNumber = itemDto.FlightNumber,
                        FlightName = itemDto.FlightName,
                        Departure = itemDto.Departure,
                        Arrival = itemDto.Arrival,
                        Price = itemDto.Price
                    });
                }
                else if (itemDto.Type.Equals("hotel", StringComparison.OrdinalIgnoreCase))
                {
                    quote.Items.Add(new QuoteHotel
                    {
                        HotelName = itemDto.HotelName,
                        CheckInDate = itemDto.CheckInDate,
                        CheckOutDate = itemDto.CheckOutDate,
                        PricePerNight = itemDto.PricePerNight
                    });
                }
            }

            _context.Quotes.Add(quote);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuote), new { id = quote.QuoteId }, ToDto(quote));
        }

        /// <summary>
        /// Exclui um orçamento pelo seu ID.
        /// </summary>
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

        /// <summary>
        /// Obtém o custo total dos hotéis para um orçamento específico.
        /// </summary>
        [HttpGet("{id}/total-hotels")]
        public async Task<ActionResult<object>> GetTotalHotels(int id)
        {
            var quote = await _context.Quotes
                .Include(q => q.Items)
                .FirstOrDefaultAsync(q => q.QuoteId == id);

            if (quote == null)
                return NotFound();

            var totalHotels = quote.Items
                .OfType<QuoteHotel>()
                .Sum(h => h.TotalPrice);

            return Ok(new { totalHotels });
        }

        /// <summary>
        /// Converte uma entidade Quote para um QuoteDto, incluindo a conversão dos itens.
        /// </summary>
        private QuoteDto ToDto(Quote quote)
        {
            var hotels = quote.Items.OfType<QuoteHotel>()
                .Select(h => new QuoteHotelDto
                {
                    Id = h.Id,
                    HotelName = h.HotelName ?? "",
                    CheckInDate = h.CheckInDate,
                    CheckOutDate = h.CheckOutDate,
                    PricePerNight = h.PricePerNight,
                    TotalPrice = h.TotalPrice
                }).ToList();

            var flights = quote.Items.OfType<QuoteFlight>()
                .Select(f => new QuoteFlightDto
                {
                    Id = f.Id,
                    FlightNumber = f.FlightNumber ?? "",
                    FlightName = f.FlightName ?? "",
                    Departure = f.Departure ?? "",
                    Arrival = f.Arrival ?? "",
                    Price = f.Price
                }).ToList();

            var totalQuote = hotels.Sum(h => h.TotalPrice) + flights.Sum(f => f.Price);

            return new QuoteDto
            {
                QuoteId = quote.QuoteId,
                RequestId = quote.RequestId,
                AgencyId = quote.AgencyId,
                Hotels = hotels,
                Flights = flights,
                TotalQuote = totalQuote
            };
        }

        /// <summary>
        /// Obtém o custo total de uma quota específica, somando hotéis e voos.
        /// </summary>
        [HttpGet("{id}/total")]
        public async Task<ActionResult<object>> GetTotalQuote(int id)
        {
            // 1. Busca o orçamento pelo ID, incluindo todos os seus itens
            var quote = await _context.Quotes
                .Include(q => q.Items)
                .FirstOrDefaultAsync(q => q.QuoteId == id);

            // 2. Verifica se o orçamento existe
            if (quote == null)
            {
                return NotFound($"Orçamento com ID {id} não encontrado.");
            }

            // 3. Calcula a soma total dos hotéis
            var totalHotels = quote.Items
                .OfType<QuoteHotel>()
                .Sum(h => h.TotalPrice);

            // 4. Calcula a soma total dos voos
            var totalFlights = quote.Items
                .OfType<QuoteFlight>()
                .Sum(f => f.Price);

            // 5. Soma os totais para obter o valor final
            var totalQuote = totalHotels + totalFlights;

            // 6. Retorna o resultado
            return Ok(new { totalQuote });
        }
    }
}
