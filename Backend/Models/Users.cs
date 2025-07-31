using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TravelUp.Models.Enum;

namespace TravelUp.Models;

public class Users
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int? UserId { get; set; }
    
    [Required]
    [StringLength(100)]
    public string? Name { get; set; }
    
    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string? Email { get; set; }
    
    [EnumDataType(typeof(Role))]
    public Role Role { get; set; } = Role.Traveler;
    
    [JsonIgnore]
    public ICollection<Request>? Requests { get; set; }
}

