namespace TravelUp.Models;

// Models/City.cs

public class City
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public int? CountryId { get; set; }
    public Country? Country { get; set; }

    // Propriedades para a relação com Request
    public ICollection<Request> OriginRequests { get; set; } = new List<Request>();
    public ICollection<Request> DestinationRequests { get; set; } = new List<Request>();
}