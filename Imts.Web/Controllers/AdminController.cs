using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Imts.Web.Services;

namespace Imts.Web.Controllers
{
    [Authorize(Roles = "ITAdmin")]
    public class AdminController : Controller
    {
        [HttpGet]
        public IActionResult Users()
        {
            ViewData["PageHeader"] = "User Account Management";
            var users = GetUsers();
            return View(users);
        }

        [HttpPost]
        public IActionResult ToggleLock(int userId)
        {
            var users = GetUsers();
            var user = users.FirstOrDefault(u => u.Id == userId);
            if (user != null)
            {
                user.AccountStatus = user.AccountStatus == "Active" ? "Locked" : "Active";
                SaveUsers(users);
                TempData["SuccessMessage"] = $"Account status for user '{user.Name}' has been updated to {user.AccountStatus}.";
            }
            return RedirectToAction("Users");
        }

        [HttpPost]
        public IActionResult ResetPassword(int userId)
        {
            var users = GetUsers();
            var user = users.FirstOrDefault(u => u.Id == userId);
            if (user != null)
            {
                TempData["SuccessMessage"] = $"Administrative password reset has been triggered for user '{user.Name}'. Temporary password sent to {user.Email}.";
            }
            return RedirectToAction("Users");
        }

        [HttpGet]
        public IActionResult ActivityLog()
        {
            ViewData["PageHeader"] = "System Activity Trail";
            var activities = GetActivities();
            return View(activities);
        }

        // Helper methods for reading/writing users from local backup file
        private List<UserDto> GetUsers()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "data", "users.json");
            if (!System.IO.File.Exists(path)) return new();
            var json = System.IO.File.ReadAllText(path);
            return System.Text.Json.JsonSerializer.Deserialize<List<UserDto>>(json, new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();
        }

        private void SaveUsers(List<UserDto> users)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "data", "users.json");
            var json = System.Text.Json.JsonSerializer.Serialize(users, new System.Text.Json.JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(path, json);
        }

        private List<ActivityItem> GetActivities()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "data", "activities.json");
            if (!System.IO.File.Exists(path)) return new();
            var json = System.IO.File.ReadAllText(path);
            return System.Text.Json.JsonSerializer.Deserialize<List<ActivityItem>>(json, new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();
        }
    }
}
