using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using TravelUp.Models.Enum;

namespace TravelUp.DTOs;
public class CreateRequestDto : IValidatableObject
{
    [Required]
    [StringLength(250)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [DataType(DataType.Date)]
    public DateTime TravelDate { get; set; }

    [DataType(DataType.Date)]
    public DateTime? ReturnDate { get; set; }

    [Required]
    public bool IsRoundTrip { get; set; }

    [Required]
    public bool NeedHotel { get; set; }

    [Required]
    [StringLength(250)]
    public string Origin { get; set; } = string.Empty;

    [Required]
    [StringLength(250)]
    public string Destination { get; set; } = string.Empty;

    [Required]
    public int UserId { get; set; }

    [Required]
    public string? Status { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (ReturnDate.HasValue && ReturnDate < TravelDate)
        {
            yield return new ValidationResult(
                "Return date cannot be earlier than travel date.",
                new[] { nameof(ReturnDate), nameof(TravelDate) }
            );
        }

        if (Origin.ToLower().Trim() == Destination.ToLower().Trim())
        {
            yield return new ValidationResult(
                "Origin and destination cannot be the same.",
                new[] { nameof(Origin), nameof(Destination) }
            );
        }

        if (IsRoundTrip && !ReturnDate.HasValue)
        {
            yield return new ValidationResult(
                "ReturnDate is required for round trips.",
                new[] { nameof(ReturnDate) }
            );
        }

        if (!string.IsNullOrEmpty(Status) &&
            !Enum.TryParse<RequestStatus>(Status, true, out _))
        {
            yield return new ValidationResult(
                "Invalid status value.",
                new[] { nameof(Status) }
            );
        }
    }
}
