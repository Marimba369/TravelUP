namespace TravelUp.Models;

using TravelUp.Models.Enum;

public class Users
{
    public string UserId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public Role Role { get; set; }

    public Users(string id, string name, string email, Role role)
    {
        UserId = id;
        Name = name;
        Email = email;
        Role = role;
    }
}