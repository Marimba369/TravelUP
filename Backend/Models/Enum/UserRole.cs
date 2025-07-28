using System.ComponentModel.DataAnnotations;

namespace TravelUp.Models.Enum;

public enum Role
{
    [Display(Name = "Traveler")]
    Traveler,
    [Display(Name = "Facilitator")]
    Facilator,
    [Display(Name = "Manager")]
    Manage
};