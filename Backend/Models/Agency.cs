using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TravelUp.Models;

public class Agency
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int AgencyId { get; set; }

    public string? Name { get; set; }
    public string? ContactEmail { get; set; }
    public string? PhoneNumber { get; set; }

    public ICollection<Quote>? Quotes { get; set; }
}