namespace TravelUp.Models;

using System.ComponentModel.DataAnnotations;
using TravelUp.Models.Enum;

public class Users
{
    [Key]
    public int? UserId { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public Role Role { get; set; }
    public ICollection<Request>? Requests { get; set; }
}