using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TravelUp.Models
{
    public class QuoteFlight : QuoteItem
    {
        public string? FlightNumber { get; set; }

        [StringLength(100)]
        public string? FlightName { get; set; }

        [StringLength(100)]
        public string? Departure { get; set; }

        [StringLength(100)]
        public string? Arrival { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }
    }
}