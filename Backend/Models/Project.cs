using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TravelUp.Models;
public class Project
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ProjectId { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [StringLength(200)]
    public string? Description { get; set; }

    public decimal AvailableBudget { get; set; }
    
    // Propriedade de navegação para a relação com a tabela Request
    public ICollection<Request> Requests { get; set; } = new List<Request>();
}