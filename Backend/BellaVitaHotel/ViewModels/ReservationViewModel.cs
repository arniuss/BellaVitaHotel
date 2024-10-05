using BellaVitaHotel.Models;

namespace BellaVitaHotel.ViewModels
{
    public class ReservationViewModel
    {
        public int Id { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public string Email { get; set; }
        public string? UserID { get; set; }
        public int RoomID { get; set; }
        public string? Message { get; set; }
    }
}
