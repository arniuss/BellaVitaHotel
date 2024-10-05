namespace BellaVitaHotel.Models
{
    public class Room
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int AdultCapacity { get; set; }
        public int ChildrenCapacity { get; set; }
        public decimal Price { get; set; }
        public List<Reservation> Reservations { get; set; }
    }
}
