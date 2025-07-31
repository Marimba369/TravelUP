namespace TravelUp.DTOs;

public class AgencyDto
{
    public int AgencyId { get; set; }
    public string? Name { get; set; }
    public string? ContactEmail { get; set; }
    public string? PhoneNumber { get; set; }

    // Inclui só um resumo das quotes para evitar ciclos e sobrecarga
    public List<QuoteSummaryDto>? Quotes { get; set; }
}
