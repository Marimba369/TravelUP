using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using TravelUp.Models.Enum;
using System.ComponentModel.DataAnnotations;

namespace TravelUp.Models;

public class Request
{
    [Key]
    public int RequestId { get; set; }
    public int Code { get; set; }
    public string? Description { get; set; }
    public RequestStatus Status { get; set; }
    public DateTime TravelDate { get; set; }
    public DateTime ReturnDate { get; set; }
    public bool IsRoundTrip { get; set; }
    public bool NeedHotel { get; set; }



    public int UserId { get; set; }
    [ForeignKey("UserId")]
    public Users? User { get; set; }

    public ICollection<Quote>? Quotes { get; set; }
}