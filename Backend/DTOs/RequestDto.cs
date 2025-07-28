namespace TravelUp.DTOs;

public class RequestDto
{
    public int RequestId { get; set; }
    public string? Code { get; set; }
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty; 
    public DateTime TravelDate { get; set; }
    public DateTime ReturnDate { get; set; }
    public bool IsRoundTrip { get; set; }
    public bool NeedHotel { get; set; }

    public int UserId { get; set; }
    public string? UserName { get; set; }  

    public List<QuoteDto>? Quotes { get; set; }
}