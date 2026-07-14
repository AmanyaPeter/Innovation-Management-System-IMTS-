using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Imts.Web.Services;

namespace Imts.Web.Controllers
{
    [Authorize]
    public class IdeasController : Controller
    {
        private readonly IdeasApiClient _ideasClient;

        public IdeasController(IdeasApiClient ideasClient)
        {
            _ideasClient = ideasClient;
        }

        [HttpGet]
        public async Task<IActionResult> MyIdeas()
        {
            ViewData["PageHeader"] = "My Ideas";

            var allIdeas = await _ideasClient.GetIdeasAsync();
            var email = User.FindFirst("Email")?.Value ?? string.Empty;
            var myIdeas = allIdeas.Where(i => i.SubmitterEmail.Equals(email, StringComparison.OrdinalIgnoreCase)).ToList();

            return View(myIdeas);
        }

        [HttpGet]
        public async Task<IActionResult> Details(int id)
        {
            ViewData["PageHeader"] = "Idea Details";

            var idea = await _ideasClient.GetIdeaByIdAsync(id);
            if (idea == null)
            {
                return NotFound();
            }

            return View(idea);
        }

        [HttpGet]
        public async Task<IActionResult> Submit()
        {
            ViewData["PageHeader"] = "Submit New Idea";
            var categories = await _ideasClient.GetCategoriesAsync();
            ViewBag.Categories = categories.Where(c => c.IsActive).ToList();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Submit(
            string title,
            string category,
            string department,
            string submissionType,
            string? fullName,
            string? email,
            string? businessUnit,
            string? dutyStation,
            string? age,
            string? gender,
            string? jobRank,
            string teamComposition,
            string executiveSummary,
            string problemOrOpportunity,
            string proposedSolution,
            string strategicObjective,
            string innovationCategory,
            string sdgContribution,
            string expectedBenefits,
            string keyEnablers,
            string implementationApproach,
            string expectedImpactIndicators,
            string? potentialRisks)
        {
            var submitterName = User.FindFirst("DisplayName")?.Value ?? User.Identity?.Name ?? "Staff";
            var submitterEmail = User.FindFirst("Email")?.Value ?? "brian@bou.or.ug";

            var individualDto = submissionType == "team" ? null : new IndividualDto
            {
                FullName = fullName,
                Email = email,
                BusinessUnit = businessUnit,
                DutyStation = dutyStation,
                Age = age,
                Gender = gender,
                JobRank = jobRank
            };

            var request = new IdeaCreateRequest(
                title,
                category,
                department,
                submitterName,
                submitterEmail,
                submissionType,
                individualDto,
                teamComposition,
                executiveSummary,
                problemOrOpportunity,
                proposedSolution,
                strategicObjective,
                innovationCategory,
                sdgContribution,
                expectedBenefits,
                keyEnablers,
                implementationApproach,
                expectedImpactIndicators,
                potentialRisks
            );

            var created = await _ideasClient.CreateIdeaAsync(request);
            if (created != null)
            {
                TempData["SuccessMessage"] = "Your idea has been submitted successfully!";
                return RedirectToAction("MyIdeas");
            }

            ModelState.AddModelError(string.Empty, "An error occurred while submitting your idea. Please try again.");
            var categories = await _ideasClient.GetCategoriesAsync();
            ViewBag.Categories = categories.Where(c => c.IsActive).ToList();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Retract(int id)
        {
            var success = await _ideasClient.RetractIdeaAsync(id);
            if (success)
            {
                TempData["SuccessMessage"] = "Idea has been retracted successfully.";
            }
            else
            {
                TempData["ErrorMessage"] = "Failed to retract idea.";
            }
            return RedirectToAction("MyIdeas");
        }

        [HttpPost]
        public async Task<IActionResult> Cancel(int id)
        {
            var success = await _ideasClient.CancelIdeaAsync(id);
            if (success)
            {
                TempData["SuccessMessage"] = "Idea has been cancelled successfully.";
            }
            else
            {
                TempData["ErrorMessage"] = "Failed to cancel idea.";
            }
            return RedirectToAction("MyIdeas");
        }

        [HttpPost]
        public async Task<IActionResult> AddComment(int id, string text)
        {
            if (!string.IsNullOrWhiteSpace(text))
            {
                var author = User.FindFirst("DisplayName")?.Value ?? User.Identity?.Name ?? "User";
                var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "Staff";
                await _ideasClient.AddCommentAsync(id, new CommentCreateRequest(author, role, text));
            }
            return RedirectToAction("Details", new { id });
        }
    }
}
