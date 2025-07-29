using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TravelUp.Models;

public class Agency
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int AgencyId { get; set; }

    [Required]
    [StringLength(100)]
    public string? Name { get; set; }
    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string? ContactEmail { get; set; }
    [Required]
    [Phone]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    public ICollection<Quote>? Quotes { get; set; }
}