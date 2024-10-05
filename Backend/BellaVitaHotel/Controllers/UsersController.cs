using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using BellaVitaHotel.Models;
using BellaVitaHotel.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace BellaVitaHotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly UserManager<User> _userManager;

        public UsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var allUsers = _userManager.Users.ToList();
            return Ok(allUsers);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            User userToShow = await _userManager.FindByIdAsync(id);

            if (userToShow != null)
            {
                return Ok(userToShow);
            }
            else
            {
                return NotFound("User not found");
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreateUser(RegistrationViewModel registrationViewModel)
        {
            User userWithSameEmail = await _userManager.FindByEmailAsync(registrationViewModel.Email);

            if (userWithSameEmail != null)
            {
                return BadRequest("User with same email already exists.");
            }

            var newUser = new User
            {
                UserName = registrationViewModel.UserName,
                Email = registrationViewModel.Email
            };

            var result = await _userManager.CreateAsync(newUser, registrationViewModel.Password);

            if (result.Succeeded)
            {
                return Ok(newUser);
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(result.Errors);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditUser(string id, UserViewModel userViewModel)
        {
            User userToEdit = await _userManager.FindByIdAsync(id);

            if (userToEdit == null)
            {
                return NotFound("User not found");
            }

            if(userViewModel.Email != null)
            {
                userToEdit.Email = userViewModel.Email;
            }

            if (userViewModel.UserName != null)
            {
                userToEdit.UserName = userViewModel.UserName;
            }

            var result = await _userManager.UpdateAsync(userToEdit);

            if (result.Succeeded)
            {
                return Ok();
            }

            return BadRequest(result.Errors);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            User userToDelete = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == id);

            if (userToDelete == null)
            {
                return NotFound("User not found");
            }

            var result = await _userManager.DeleteAsync(userToDelete);

            if (result.Succeeded)
            {
                return Ok("User deleted successfully");
            }

            return BadRequest(result.Errors);
        }
    }
}
