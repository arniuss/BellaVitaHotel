using BellaVitaHotel.Models;
using Microsoft.AspNetCore.Identity;

namespace BellaVitaHotel.Data
{
    public class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

            if(!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            var user = await userManager.FindByEmailAsync("admin@admin.com");

            if(user == null)
            {
                user = new User
                {
                    UserName = "admin",
                    Email = "admin@admin.com"
                };
                string secretPassword = configuration["AdminPassword"];
                await userManager.CreateAsync(user, secretPassword);
            }

            if (!await userManager.IsInRoleAsync(user, "Admin"))
            {
                await userManager.AddToRoleAsync(user, "Admin");
            }
        }
    }
}
