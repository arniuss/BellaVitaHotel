using BellaVitaHotel.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BellaVitaHotel.Data
{
    public class HotelDbContext : IdentityDbContext<IdentityUser>
    {
        public DbSet<User> Users {  get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public HotelDbContext(DbContextOptions<HotelDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reservations)
                .HasForeignKey(r => r.UserID)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
