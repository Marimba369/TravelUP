using TravelUp.Models;
namespace TravelUp.DTOs;
public class RequestDto
{
    public int RequestId { get; set; }
    public string Description { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime TravelDate { get; set; }
    public DateTime? ReturnDate { get; set; }
    public bool IsRoundTrip { get; set; }
    public bool NeedHotel { get; set; }

    public string OriginCityName { get; set; } = null!;
    public string DestinationCityName { get; set; } = null!;

     public ProjectDto? Project { get; set; }

    public int UserId { get; set; }
    public ICollection<Quote> Quotes { get; set; } = new List<Quote>();

}