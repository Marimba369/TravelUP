using System.ComponentModel.DataAnnotations;

namespace TravelUp.Models.Enum
{
    public enum  Role
    {
        [Display(Name = "Traveler")]
        Traveler = 1,

        [Display(Name = "Facilitator")]
        Facilitator = 2,

        [Display(Name = "Manager")]
        Manager = 3
    }
}
