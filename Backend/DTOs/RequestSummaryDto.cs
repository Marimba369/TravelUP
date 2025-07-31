using TravelUp.Models.Enum;

namespace TravelUp.DTOs
{
    public class RequestSummaryDto
    {
        public int RequestId { get; set; }
        public string? Description { get; set; }

        public RequestStatus Status { get; set; }

        public DateTime? TravelDate { get; set; }
        public DateTime? ReturnDate { get; set; }
    }
}