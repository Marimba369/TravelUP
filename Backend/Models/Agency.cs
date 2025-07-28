namespace TravelUp.Models;

public class Agency
{
    public int AgencyId { get; set; }
    public string? Name { get; set; }
    public string? ContactEmail { get; set; }
    public string? PhoneNumber { get; set; }

    public ICollection<Quote>? Quotes { get; set; }
        
    // Propriedade de Navegação para o relacionamento 1:N com Quote
}