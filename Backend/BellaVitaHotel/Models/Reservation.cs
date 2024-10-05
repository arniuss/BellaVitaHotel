namespace BellaVitaHotel.Models
{
    public class Reservation
    {
        public int ID { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public string Email { get; set; }
        public string? UserID { get; set; }
        public User? User { get; set; }
        public int RoomID { get; set; }
        public Room Room { get; set; }
        public string RoomName {  get; set; }
        public string? Message { get; set; }
    }
}
