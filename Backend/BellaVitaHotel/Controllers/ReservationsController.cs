using BellaVitaHotel.Data;
using BellaVitaHotel.Models;
using BellaVitaHotel.RabbitMQ;
using BellaVitaHotel.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BellaVitaHotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : Controller
    {
        private HotelDbContext _hotelDbContext;
        private EmailProducer _emailProducer;

        public ReservationsController(HotelDbContext hotelDbContext, EmailProducer createEmail)
        {
            _hotelDbContext = hotelDbContext;
            _emailProducer = createEmail;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllReservations()
        {
            var allReservations = _hotelDbContext.Reservations.ToList();
            return Ok(allReservations);
        }
        [HttpGet("MyReservations")]
        public async Task<IActionResult> GetAllMyReservations(string id)
        {
            var myReservations = await _hotelDbContext.Reservations
                .Where(reservation => reservation.UserID == id)
                .Include(reservation => reservation.Room)
                .Select(reservation => new
                {
                    reservation.ID,
                    reservation.CheckInDate,
                    reservation.CheckOutDate,
                    reservation.Message,
                    RoomName = reservation.Room.Name
                }).ToListAsync();

            return Ok(myReservations);
        }

        [HttpPost]
        public async Task<IActionResult> CreateReservation(ReservationViewModel newReservation)
        {
            if (newReservation == null)
            {
                return BadRequest("Reservation data is null");
            }

            var user = await _hotelDbContext.Users.FirstOrDefaultAsync(x => x.Email == newReservation.Email);

            if (user != null)
            {
                newReservation.UserID = user.Id;
            } else
            {
                newReservation.UserID = null;
            }

            var room = await _hotelDbContext.Rooms.FindAsync(newReservation.RoomID);
            if (room == null)
            {
                return BadRequest($"Room with ID {newReservation.RoomID} not found.");
            }

            var reservation = new Reservation
            {
                ID = newReservation.Id,
                Email = newReservation.Email,
                UserID = newReservation.UserID,
                RoomID = newReservation.RoomID,
                RoomName = room.Name,
                CheckInDate = newReservation.CheckInDate,
                CheckOutDate = newReservation.CheckOutDate
            };

            await _hotelDbContext.Reservations.AddAsync(reservation);
            await _hotelDbContext.SaveChangesAsync();

            var email = newReservation.Email;
            var message = $"Děkujeme za rezervaci na {newReservation.CheckInDate} - {newReservation.CheckOutDate}.";

            _emailProducer.SendEmailNotification(email, message);

            return CreatedAtAction(nameof(CreateReservation), new { id = newReservation.Id }, newReservation);
        }

        [HttpPut]
        public async Task<IActionResult> EditReservation(int id, ReservationViewModel reservationViewModel)
        {
            Reservation reservationToEdit = await _hotelDbContext.Reservations.FirstOrDefaultAsync(x => x.ID == id);

            if (reservationToEdit == null)
            {
                return NotFound("Reservation not found");
            }

            reservationToEdit.CheckInDate = reservationViewModel.CheckInDate;
            reservationToEdit.CheckOutDate = reservationViewModel.CheckOutDate;
            reservationToEdit.RoomID = reservationViewModel.RoomID;
            reservationToEdit.UserID = reservationViewModel.UserID;
            reservationToEdit.Message = reservationViewModel.Message;

            _hotelDbContext.Reservations.Update(reservationToEdit);
            await _hotelDbContext.SaveChangesAsync();

            return Ok("Reservation updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            Reservation reservationToDelete = await _hotelDbContext.Reservations.FirstOrDefaultAsync(x => x.ID == id);

            if(reservationToDelete == null)
            {
                return NotFound("Reservation not found");
            }

            _hotelDbContext.Reservations.Remove(reservationToDelete);
            await _hotelDbContext.SaveChangesAsync();

            return Ok("Reservation removed successfully");
        }
    }
}
