using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TravelUp.Models
{
    public class QuoteHotel : QuoteItem
    {
        [StringLength(100)]
        public string? HotelName { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime CheckInDate { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime CheckOutDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal PricePerNight { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        [NotMapped]
        public decimal TotalPrice => (decimal)(CheckOutDate - CheckInDate).TotalDays * PricePerNight;
    }
}