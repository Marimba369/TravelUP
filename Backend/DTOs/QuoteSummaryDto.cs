namespace TravelUp.DTOs
{
    public class QuoteSummaryDto
    {
        public int QuoteId { get; set; }
        public string? HotelName { get; set; }
        public string? FlightName { get; set; }
        public double Cost { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
    }
}
