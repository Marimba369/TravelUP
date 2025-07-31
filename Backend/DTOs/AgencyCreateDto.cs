using System.ComponentModel.DataAnnotations;

public class AgencyCreateDto
{
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
}
