using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace BellaVitaHotel.Models
{
    public class User : IdentityUser
    {
        public string Name { get; set; }
        [JsonIgnore]
        public List<Reservation>? Reservations { get; set; }
    }
}
