using System.ComponentModel.DataAnnotations;
using TravelUp.Models.Enum;

public class RequestCreateDto
{
    [Required]
    public int Code { get; set; }

    public string? Description { get; set; }

    [Required]
    public RequestStatus Status { get; set; }

    [Required]
    public DateTime TravelDate { get; set; }

    [Required]
    public DateTime ReturnDate { get; set; }

    [Required]
    public bool IsRoundTrip { get; set; }

    [Required]
    public bool NeedHotel { get; set; }

    [Required]
    public int UserId { get; set; }
}