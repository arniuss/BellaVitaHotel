using BellaVitaHotel.Data;
using BellaVitaHotel.Models;
using BellaVitaHotel.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BellaVitaHotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : Controller
    {
        private HotelDbContext _hotelDbContext;

        public RoomsController(HotelDbContext hotelDbContext)
        {
            _hotelDbContext = hotelDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRooms()
        {
            var allRooms = await _hotelDbContext.Rooms.ToListAsync();
            return Ok(allRooms);
        }
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableRooms(DateTime startDate, DateTime endDate)
        {
            var allRooms = _hotelDbContext.Rooms.ToList();

            var notAvailableRooms = await _hotelDbContext.Reservations
                .Where(r => (r.CheckInDate < endDate && r.CheckOutDate > startDate))
                .Select(r => r.RoomID)
                .ToListAsync();

            var availableRooms = allRooms.Where(room => !notAvailableRooms.Contains(room.ID)).ToList();

            return Ok(availableRooms);
        }

        [HttpGet("availableRoomById")]
        public async Task<IActionResult> CheckAvailabilityById(int id)
        {
            var bookedDays = await _hotelDbContext.Reservations
                .Where(r => r.RoomID == id && r.CheckInDate != DateTime.MinValue && r.CheckOutDate != DateTime.MinValue)
                .Select(r => new
                {
                    checkInDate = r.CheckInDate,
                    checkOutDate = r.CheckOutDate
                }).ToListAsync();

            return Ok(bookedDays);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNewRoom(RoomViewModel roomViewModel)
        {
            if (roomViewModel == null)
            {
                return BadRequest("New room data is null");
            }

            Room newRoom = new Room
            {
                Name = roomViewModel.Name,
                AdultCapacity = roomViewModel.AdultCapacity,
                ChildrenCapacity = roomViewModel.ChildrenCapacity,
                Price = roomViewModel.Price
            };

            await _hotelDbContext.Rooms.AddAsync(newRoom);
            await _hotelDbContext.SaveChangesAsync();

            return Ok(newRoom);
        }

        [HttpPut]
        public async Task<IActionResult> EditRoom(int id, RoomViewModel roomViewModel)
        {
            Room roomToEdit = await _hotelDbContext.Rooms.FirstOrDefaultAsync(x => x.ID == id);

            if(roomToEdit == null)
            {
                return NotFound("Room not found");
            }

            roomToEdit.Name = roomViewModel.Name;
            roomToEdit.AdultCapacity = roomViewModel.AdultCapacity;
            roomToEdit.ChildrenCapacity = roomViewModel.ChildrenCapacity;
            roomToEdit.Price = roomViewModel.Price;

            _hotelDbContext.Rooms.Update(roomToEdit);
            await _hotelDbContext.SaveChangesAsync();

            return Ok("Room updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            Room roomToDelete = await _hotelDbContext.Rooms.FirstOrDefaultAsync(x => x.ID == id);

            if (roomToDelete == null)
            {
                return NotFound("Room not found");
            }

            _hotelDbContext.Rooms.Remove(roomToDelete);
            await _hotelDbContext.SaveChangesAsync();

            return Ok("Room removed successfully");
        }
    }
}
