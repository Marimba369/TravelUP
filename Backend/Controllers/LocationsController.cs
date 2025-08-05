using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelUp.Data;
using TravelUp.DTOs;

namespace TravelUp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public LocationsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("countries")]
    public async Task<IActionResult> GetCountries()
    {
        var countries = await _context.Countries.ToListAsync();
        return Ok(countries);
    }

    [HttpGet("cities")]
    public async Task<IActionResult> GetCities()
    {
        var cities = await _context.Cities
            .Include(c => c.Country)
            .Select(c => new CityDto
            {
                Id = c.Id,
                Name = c.Name,
                Country = new CountryDto
                {
                    Id = c.Country.Id,
                    Name = c.Country.Name,
                    Code = c.Country.Code
                }
            })
            .ToListAsync();

        return Ok(cities);
    }
}