using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using TravelUp.Models.Enum;

namespace TravelUp.DTOs;
public class CreateRequestDto
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

    [Required(ErrorMessage = "O ID da cidade de origem é obrigatório.")]
    public int OriginCityId { get; set; }

    [Required(ErrorMessage = "O ID da cidade de destino é obrigatório.")]
    public int DestinationCityId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public string? Status { get; set; }
}
