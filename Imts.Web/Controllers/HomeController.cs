using System.Diagnostics;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Imts.Web.Models;
using Imts.Web.Services;

namespace Imts.Web.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly IdeasApiClient _ideasClient;
        private readonly AuthApiClient _authClient;

        public HomeController(IdeasApiClient ideasClient, AuthApiClient authClient)
        {
            _ideasClient = ideasClient;
            _authClient = authClient;
        }

        [AllowAnonymous]
        public IActionResult Index()
        {
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Dashboard");
            }
            return RedirectToAction("Login", "Account");
        }

        [HttpGet]
        public async Task<IActionResult> Dashboard()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "Staff";

            if (role == "ITAdmin")
            {
                return await AdminDashboard();
            }
            if (role == "InnovationTeam")
            {
                return await InnovationDashboard();
            }

            return await StaffDashboard();
        }

        private async Task<IActionResult> StaffDashboard()
        {
            ViewData["PageHeader"] = "Dashboard";

            var allIdeas = await _ideasClient.GetIdeasAsync();
            var email = User.FindFirst("Email")?.Value ?? string.Empty;
            var myIdeas = allIdeas.Where(i => i.SubmitterEmail.Equals(email, StringComparison.OrdinalIgnoreCase)).ToList();

            ViewBag.TotalSubmitted = myIdeas.Count;
            ViewBag.UnderReview = myIdeas.Count(i => i.Status.Equals("Under Review", StringComparison.OrdinalIgnoreCase));
            ViewBag.Approved = myIdeas.Count(i => i.Status.Equals("Approved", StringComparison.OrdinalIgnoreCase));
            ViewBag.Completed = myIdeas.Count(i => i.Stage.Equals("Closed", StringComparison.OrdinalIgnoreCase) && i.Status.Equals("Approved", StringComparison.OrdinalIgnoreCase));

            ViewBag.RecentSubmissions = myIdeas.OrderByDescending(i => i.DateSubmitted).Take(5).ToList();
            ViewBag.RecentNotifications = GetNotifications().Take(4).ToList();

            return View("StaffDashboard");
        }

        private async Task<IActionResult> InnovationDashboard()
        {
            ViewData["PageHeader"] = "Review Dashboard";

            var allIdeas = await _ideasClient.GetIdeasAsync();

            ViewBag.SubmittedCount = allIdeas.Count(i => i.Stage.Equals("Submitted", StringComparison.OrdinalIgnoreCase));
            ViewBag.ConceptCount = allIdeas.Count(i => i.Stage.Equals("Concept Development", StringComparison.OrdinalIgnoreCase));
            ViewBag.ExperimentationCount = allIdeas.Count(i => i.Stage.Equals("Experimentation", StringComparison.OrdinalIgnoreCase));
            ViewBag.DeploymentCount = allIdeas.Count(i => i.Stage.Equals("Deployment", StringComparison.OrdinalIgnoreCase));

            // SLA alerts
            ViewBag.SlaBreaches = allIdeas.Count(i => i.ReviewSlaStatus.Equals("Breached", StringComparison.OrdinalIgnoreCase));
            ViewBag.SlaWarning = allIdeas.Count(i => i.ReviewSlaStatus.Equals("Warning", StringComparison.OrdinalIgnoreCase));
            ViewBag.SlaOnTrack = allIdeas.Count(i => i.ReviewSlaStatus.Equals("On Track", StringComparison.OrdinalIgnoreCase));

            ViewBag.ReviewQueue = allIdeas.Where(i => i.Status.Equals("Submitted", StringComparison.OrdinalIgnoreCase) || i.Status.Equals("Under Review", StringComparison.OrdinalIgnoreCase)).ToList();

            return View("InnovationDashboard");
        }

        private async Task<IActionResult> AdminDashboard()
        {
            ViewData["PageHeader"] = "Admin Dashboard";

            var users = await _authClient.GetUsersAsync();
            ViewBag.TotalUsers = users.Count;
            ViewBag.ActiveUsers = users.Count(u => u.AccountStatus.Equals("Active", StringComparison.OrdinalIgnoreCase));
            ViewBag.LockedUsers = users.Count(u => u.AccountStatus.Equals("Locked", StringComparison.OrdinalIgnoreCase));

            var activities = GetActivities();
            ViewBag.RecentActivityCount = activities.Count(a => {
                if (DateTime.TryParse(a.Timestamp, out var ts))
                {
                    return ts > DateTime.UtcNow.AddDays(-7);
                }
                return false;
            });

            ViewBag.RecentLogins = activities.Where(a => a.Action.Equals("Login", StringComparison.OrdinalIgnoreCase)).OrderByDescending(a => a.Timestamp).Take(5).ToList();
            ViewBag.RecentActivities = activities.OrderByDescending(a => a.Timestamp).Take(5).ToList();

            return View("AdminDashboard");
        }

        [HttpGet]
        public IActionResult Notifications()
        {
            ViewData["PageHeader"] = "Notifications";
            var notifications = GetNotifications();
            return View(notifications);
        }

        [HttpGet]
        public IActionResult Resources()
        {
            ViewData["PageHeader"] = "Resources";
            var resources = GetResources();
            return View(resources);
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        // Helper methods for reading static JSON databases
        private List<NotificationItem> GetNotifications()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "data", "notifications.json");
            if (!System.IO.File.Exists(path)) return new();
            var json = System.IO.File.ReadAllText(path);
            return System.Text.Json.JsonSerializer.Deserialize<List<NotificationItem>>(json, new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();
        }

        private List<ResourceItem> GetResources()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "data", "resources.json");
            if (!System.IO.File.Exists(path)) return new();
            var json = System.IO.File.ReadAllText(path);
            return System.Text.Json.JsonSerializer.Deserialize<List<ResourceItem>>(json, new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();
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
