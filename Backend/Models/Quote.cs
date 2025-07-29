using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TravelUp.Models;

public class Quote
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int QuoteId { get; set; }
    [StringLength(100)]
    public string? HotelName { get; set; }
    [StringLength(100)]
    public string? FlightName { get; set; }
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public double Cost { get; set; }
    [Required]
    [ForeignKey(nameof(Request))]
    public int RequestId { get; set; }
    public Request? Request { get; set; }

    [Required]
    [ForeignKey(nameof(Agency))]
    public int AgencyId { get; set; }
    public Agency? Agency { get; set; }

    [Required]
    [DataType(DataType.Date)]
    public DateTime CheckInDate { get; set; }
    [Required]
    [DataType(DataType.Date)]
    public DateTime CheckOutDate { get; set; }
}