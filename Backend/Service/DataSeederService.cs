using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;
using TravelUp.Data;
using TravelUp.Models;
using Microsoft.EntityFrameworkCore;

namespace TravelUp.Service;

public class DataSeederService
{
    private readonly AppDbContext _context;

    public DataSeederService(AppDbContext context)
    {
        _context = context;
    }

    public async Task SeedDataAsync()
    {
        if (await _context.Countries.AnyAsync())
        {
            return; // Os dados já existem, não faça a importação novamente.
        }

        var csvConfig = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true
        };

        using (var reader = new StreamReader("Data/locations.csv"))
        using (var csv = new CsvReader(reader, csvConfig))
        {
            var records = csv.GetRecords<CsvLocationRecord>().ToList();

            var countries = records.GroupBy(r => r.CountryName)
                                   .Select(g => new Country { Name = g.Key, Code = g.First().CountryCode })
                                   .ToList();

            await _context.Countries.AddRangeAsync(countries);
            await _context.SaveChangesAsync();

            var dbCountries = await _context.Countries.ToDictionaryAsync(c => c.Name, c => c.Id);

            var cities = records.Select(r => new City
            {
                Name = r.CityName,
                CountryId = dbCountries[r.CountryName]
            }).ToList();

            await _context.Cities.AddRangeAsync(cities);
            await _context.SaveChangesAsync();
        }
    }
}

