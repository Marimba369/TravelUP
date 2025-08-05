using System;
using System.Collections.Generic;

namespace TravelUp.DTOs
{
    public class QuoteDto
    {
        public int QuoteId { get; set; }
        public int RequestId { get; set; }
        public int AgencyId { get; set; }
        public List<QuoteHotelDto> Hotels { get; set; } = new List<QuoteHotelDto>();
        public List<QuoteFlightDto> Flights { get; set; } = new List<QuoteFlightDto>();
        public decimal TotalQuote { get; set; }
    }

    public class QuoteHotelDto
    {
        public int Id { get; set; }
        public string HotelName { get; set; } = string.Empty;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal PricePerNight { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class QuoteFlightDto
    {
        public int Id { get; set; }
        public string FlightNumber { get; set; } = string.Empty;
        public string FlightName { get; set; } = string.Empty;
        public string Departure { get; set; } = string.Empty;
        public string Arrival { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
    public class QuoteItemCreateDto
    {
        public string Type { get; set; } = string.Empty;
        public string? FlightNumber { get; set; }
        public string? FlightName { get; set; }
        public string? Departure { get; set; }
        public string? Arrival { get; set; }
        public decimal Price { get; set; }
        public string? HotelName { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal PricePerNight { get; set; }
    }

    public class QuoteCreateDto
    {
        public int RequestId { get; set; }
        public int AgencyId { get; set; }
        public List<QuoteItemCreateDto> Items { get; set; } = new List<QuoteItemCreateDto>();
    }
}