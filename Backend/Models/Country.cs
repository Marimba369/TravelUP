
namespace TravelUp.Models;

public class Country
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; } // Ex: BR, US
    public List<City> Cities { get; set; }
}