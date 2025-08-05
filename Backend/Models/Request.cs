using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using TravelUp.Models.Enum;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using TravelUp.Models;

namespace TravelUp.Models
{
    public class Request
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RequestId { get; set; }

        [Required]
        public string Description { get; set; } = null!;

        [Required]
        public string Status { get; set; } = null!;

        [Required]
        [DataType(DataType.Date)]
        public DateTime TravelDate { get; set; }

        [DataType(DataType.Date)]
        public DateTime? ReturnDate { get; set; }

        [Required]
        public bool IsRoundTrip { get; set; }

        [Required]
        public bool NeedHotel { get; set; }

        [Required]
        [StringLength(250)]
        public string Origin { get; set; } = null!;

        [Required]
        [StringLength(250)]
        public string Destination { get; set; } = null!;

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }

        public Users? User { get; set; }

        [JsonIgnore]
        public ICollection<Quote> Quotes { get; set; } = new List<Quote>();
    }
}

