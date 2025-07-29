using System.ComponentModel.DataAnnotations;
using TravelUp.Models;
using TravelUp.Models.Enum;

namespace TravelUp.DTOs;

public class RequestDto
{
    [Key]
    public int RequestId { get; set; }
    public int? Code { get; set; }
    public string? Description { get; set; }
    [Required]
    public RequestStatus Status { get; set; } = RequestStatus.Draft; 
    public DateTime TravelDate { get; set; }
    public DateTime ReturnDate { get; set; }
    public bool IsRoundTrip { get; set; }
    public bool NeedHotel { get; set; }

    public int UserId { get; set; }
    public string? UserName { get; set; }  

    public List<QuoteDto>? Quotes { get; set; }
}