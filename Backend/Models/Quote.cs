using System.ComponentModel.DataAnnotations.Schema;

namespace TravelUp.Models;

public class Quote
{
    public int QuoteId { get; set; }

    public string? HotelName { get; set; }
    public string? FlightName { get; set; }
    public double Cost { get; set; }

    public int UserId { get; set; }

    public int RequestId { get; set; }

    [ForeignKey("RequestId")]
    public Request? Request { get; set; } // Propriedade de Navegação para a Request

    // Chave Estrangeira para a Agency que forneceu a cotação
    public int AgencyId { get; set; }
    [ForeignKey("AgencyId")]
    public Agency? Agency { get; set; }

    public Quote(int quoteId, string? hotelName, string? flightName, double cost, int userId, int requestId, int agencyId)
    {
        QuoteId = quoteId;
        HotelName = hotelName;
        FlightName = flightName;
        Cost = cost;
        UserId = userId;
        RequestId = requestId;
        AgencyId = agencyId;
    }
    public Quote() { }

}