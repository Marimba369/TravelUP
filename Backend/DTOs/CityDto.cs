namespace TravelUp.DTOs;

public class CityDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public CountryDto? Country { get; set; } // Referencia o DTO do País
}