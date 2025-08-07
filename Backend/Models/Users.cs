using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;
using TravelUp.Models.Enum;

namespace TravelUp.Models;

public class Users
{
    private const string SALT = "AsArmasEOsBarõesAssinalados";

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int? UserId { get; set; }

    [Required]
    [StringLength(100)]
    public string? Name { get; set; }

    [Required]
    public String? Role { get; set; }

    [MaxLength(254)]
    public string Username { get; set; } = "";

    [MaxLength(1024)]
    public string PasswordHash { get; set; } = "";

    [JsonIgnore]
    public ICollection<Request>? Requests { get; set; }
    public string GeneratePassHash(string password)
    {
        using (SHA512 sha512 = SHA512.Create())
        {
            var sSourceData = this.Username + SALT + password;
            byte[] tmpSource = Encoding.UTF8.GetBytes(sSourceData);

            //Compute hash based on source data
            byte[] tmpHash = sha512.ComputeHash(tmpSource);

            return System.Text.Encoding.UTF8.GetString(tmpHash);
        }
    }

    public bool CheckPasswordAsync(string password)
    {
        var hash = this.GeneratePassHash(password);
        return PasswordHash.Equals(hash);
    }

}

