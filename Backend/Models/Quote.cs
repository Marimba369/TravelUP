using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TravelUp.Models;

namespace TravelUp.Models;

public class Quote
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int QuoteId { get; set; }

    [Required]
    [ForeignKey(nameof(Request))]
    public int RequestId { get; set; }
    
    [JsonIgnore]
    public Request? Request { get; set; }

    [Required]
    [ForeignKey(nameof(Agency))]
    public int AgencyId { get; set; }

    public Agency? Agency { get; set; }

    public ICollection<QuoteItem> Items { get; set; } = new List<QuoteItem>();

    [Column(TypeName = "decimal(10,2)")]
    [NotMapped]
    public decimal TotalQuote => Items.Sum(i =>
        i switch
        {
            QuoteHotel hotel => hotel.TotalPrice,
            QuoteFlight flight => flight.Price,
            _ => 0m
        });
}
