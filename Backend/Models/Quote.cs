using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TravelUp.Models;

public class Quote
{
    [Key]
    public int QuoteId { get; set; }
    public string? HotelName { get; set; }
    public string? FlightName { get; set; }
    public double Cost { get; set; }
    
    public int RequestId { get; set; }
    public Request? Request { get; set; } 

    public int AgencyId { get; set; }
    public Agency? Agency { get; set; }
}