using System.ComponentModel.DataAnnotations;

namespace TravelUp.DTOs;

public class CreateProjectDto
{
    
    [Required]
    public string Name { get; set; } = null!;
    [Required]
    public string? Description { get; set; }
    [Required]
    public decimal AvailableBudget { get; set; }
}