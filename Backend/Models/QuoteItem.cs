using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TravelUp.Models
{
    public abstract class QuoteItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(Quote))]
        public int QuoteId { get; set; }

        [JsonIgnore]
        public Quote? Quote { get; set; }
    }
}
