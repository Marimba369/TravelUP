using System.ComponentModel.DataAnnotations;
using TravelUp.Models.Enum;

namespace TravelUp.DTOs
{
    public class UserCreateDto
    {
        [Required]
        [StringLength(100)]
        public string? Name { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [Required]
        public String? Role { get; set; }
    }
}
