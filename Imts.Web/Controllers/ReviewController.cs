using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Imts.Web.Services;

namespace Imts.Web.Controllers
{
    [Authorize(Roles = "InnovationTeam")]
    public class ReviewController : Controller
    {
        private readonly IdeasApiClient _ideasClient;

        public ReviewController(IdeasApiClient ideasClient)
        {
            _ideasClient = ideasClient;
        }

        [HttpGet]
        public async Task<IActionResult> SubmittedIdeas()
        {
            ViewData["PageHeader"] = "Submitted Ideas Queue";
            var ideas = await _ideasClient.GetIdeasAsync();
            return View(ideas);
        }

        [HttpGet]
        public async Task<IActionResult> ReviewIdea(int id)
        {
            ViewData["PageHeader"] = "Review Idea Console";
            var idea = await _ideasClient.GetIdeaByIdAsync(id);
            if (idea == null)
            {
                return NotFound();
            }
            return View(idea);
        }

        [HttpPost]
        public async Task<IActionResult> ReviewIdea(int id, string decision, string? note)
        {
            var reviewerName = User.FindFirst("DisplayName")?.Value ?? User.Identity?.Name ?? "Reviewer";
            var success = await _ideasClient.ReviewIdeaAsync(id, new ReviewRequest(decision, note, reviewerName));
            if (success)
            {
                TempData["SuccessMessage"] = $"Idea status has been updated successfully to {decision}.";
                return RedirectToAction("SubmittedIdeas");
            }

            TempData["ErrorMessage"] = "Failed to update review status.";
            return RedirectToAction("ReviewIdea", new { id });
        }

        [HttpGet]
        public async Task<IActionResult> Categories()
        {
            ViewData["PageHeader"] = "Configure Categories";
            var categories = await _ideasClient.GetCategoriesAsync();
            return View(categories);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory(string name, string? description)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                TempData["ErrorMessage"] = "Category name is required.";
                return RedirectToAction("Categories");
            }

            var category = new Category { Name = name, Description = description, IsActive = true };
            var created = await _ideasClient.CreateCategoryAsync(category);
            if (created != null)
            {
                TempData["SuccessMessage"] = $"Category '{name}' created successfully.";
            }
            else
            {
                TempData["ErrorMessage"] = "Failed to create category.";
            }
            return RedirectToAction("Categories");
        }

        [HttpPost]
        public async Task<IActionResult> UpdateCategory(int id, string name, string? description, bool isActive)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                TempData["ErrorMessage"] = "Category name is required.";
                return RedirectToAction("Categories");
            }

            var category = new Category { Id = id, Name = name, Description = description, IsActive = isActive };
            var updated = await _ideasClient.UpdateCategoryAsync(id, category);
            if (updated != null)
            {
                TempData["SuccessMessage"] = $"Category updated successfully.";
            }
            else
            {
                TempData["ErrorMessage"] = "Failed to update category.";
            }
            return RedirectToAction("Categories");
        }

        [HttpPost]
        public async Task<IActionResult> ToggleCategoryStatus(int id, string name, string? description, bool isActive)
        {
            var category = new Category { Id = id, Name = name, Description = description, IsActive = !isActive };
            var updated = await _ideasClient.UpdateCategoryAsync(id, category);
            if (updated != null)
            {
                TempData["SuccessMessage"] = $"Category status toggled successfully.";
            }
            return RedirectToAction("Categories");
        }

        [HttpPost]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var success = await _ideasClient.DeleteCategoryAsync(id);
            if (success)
            {
                TempData["SuccessMessage"] = "Category deleted successfully.";
            }
            else
            {
                TempData["ErrorMessage"] = "Failed to delete category.";
            }
            return RedirectToAction("Categories");
        }

        [HttpGet]
        public async Task<IActionResult> Reports()
        {
            ViewData["PageHeader"] = "Reports & Analytics";
            var ideas = await _ideasClient.GetIdeasAsync();
            return View(ideas);
        }

        [HttpGet]
        public IActionResult Permissions()
        {
            ViewData["PageHeader"] = "Granular Permissions Console";
            var users = GetUsers();
            return View(users);
        }

        [HttpPost]
        public IActionResult UpdateUserPermissions(int userId, string role, string permissionsList)
        {
            var users = GetUsers();
            var user = users.FirstOrDefault(u => u.Id == userId);
            if (user != null)
            {
                user.Role = role;
                user.Permissions = permissionsList?.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(p => p.Trim()).ToList() ?? new();
                SaveUsers(users);
                TempData["SuccessMessage"] = $"Permissions for user '{user.Name}' updated successfully.";
            }
            return RedirectToAction("Permissions");
        }

        [HttpPost]
        public IActionResult ToggleUserActive(int userId)
        {
            var users = GetUsers();
            var user = users.FirstOrDefault(u => u.Id == userId);
            if (user != null)
            {
                user.AccountStatus = user.AccountStatus == "Active" ? "Locked" : "Active";
                SaveUsers(users);
                TempData["SuccessMessage"] = $"User '{user.Name}' status toggled to {user.AccountStatus}.";
            }
            return RedirectToAction("Permissions");
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
    }
}
