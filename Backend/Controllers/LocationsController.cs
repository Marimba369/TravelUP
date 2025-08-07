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
    public async Task<IActionResult> GetCountries([FromQuery] string? q) // Adicione novamente o parâmetro 'q'
    {
        var countriesQuery = _context.Countries.AsQueryable();

        if (!string.IsNullOrEmpty(q))
        {
            countriesQuery = countriesQuery.Where(c => c.Name.ToLower().Contains(q.ToLower()));
        }

        var countries = await countriesQuery.ToListAsync();
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

    [HttpGet("cities-by-country/{countryName}")]
    public async Task<IActionResult> GetCitiesByCountryName(string countryName, [FromQuery] string? q) // Adicione novamente o parâmetro 'q'
    {
        var country = await _context.Countries
            .FirstOrDefaultAsync(c => c.Name.ToLower() == countryName.ToLower());

        if (country == null)
        {
            return NotFound($"País '{countryName}' não encontrado.");
        }

        var citiesQuery = _context.Cities
            .Where(c => c.CountryId == country.Id)
            .AsQueryable();

        if (!string.IsNullOrEmpty(q))
        {
            citiesQuery = citiesQuery.Where(c => c.Name.ToLower().Contains(q.ToLower()));
        }

        var cities = await citiesQuery
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