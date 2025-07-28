namespace TravelUp.DTOs;

public class QuoteDto
{
    public int QuoteId { get; set; }
    public string? HotelName { get; set; }
    public string? FlightName { get; set; }
    public double Cost { get; set; }
    public int RequestId { get; set; }
    public int AgencyId { get; set; }
    public string? AgencyName { get; set; } 
}
