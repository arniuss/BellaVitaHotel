using BellaVitaHotel.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using BellaVitaHotel.ViewModels;
using BellaVitaHotel.Models;
using Microsoft.EntityFrameworkCore;

namespace BellaVitaHotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInUser;
        private HotelDbContext _hotelDbContext;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInUser, HotelDbContext hotelDbContext)
        {
            _userManager = userManager;
            _signInUser = signInUser;
            _hotelDbContext = hotelDbContext;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegistrationViewModel registrationViewModel)
        {
            var userWithSameEmail = await _userManager.FindByEmailAsync(registrationViewModel.Email);

            if (userWithSameEmail != null)
            {
                return BadRequest(new { Errors = new[] { "User with same email already exists." } });
            }

            var userWithSameNickname = await _userManager.Users.FirstOrDefaultAsync(user => user.Name == registrationViewModel.UserName);

            if (userWithSameNickname != null)
            {
                return BadRequest(new { Errors = new[] { "User with same nickname already exists." } });
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

            var errors = result.Errors.Select(error => error.Description).ToArray();
            return BadRequest(new { Errors = errors });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginViewModel loginViewModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model data.");
            }

            var user = await _hotelDbContext.Users.FirstOrDefaultAsync(user => user.Email == loginViewModel.Email);

            if(user == null)
            {
                return BadRequest("Invalid email.");
            }

            var result = await _signInUser.PasswordSignInAsync(
                        (User)user, loginViewModel.Password, loginViewModel.RememberMe, false);

            if (result.Succeeded)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var role = roles.Contains("Admin") ? "Admin" : null;
                return Ok(new { username = user.UserName, email = user.Email, userID = user.Id, role });
            }

            return BadRequest("Invalid email or password.");
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInUser.SignOutAsync();
            return Ok(new { message = "User logged out successfully." });
        }
    }
}
