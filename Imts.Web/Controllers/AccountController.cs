using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Imts.Web.Services;

namespace Imts.Web.Controllers
{
    public class AccountController : Controller
    {
        private readonly AuthApiClient _authClient;

        public AccountController(AuthApiClient authClient)
        {
            _authClient = authClient;
        }

        [HttpGet]
        public IActionResult Login()
        {
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Dashboard", "Home");
            }
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                ModelState.AddModelError(string.Empty, "Username and password are required.");
                return View();
            }

            var loginResponse = await _authClient.LoginAsync(username, password);
            if (loginResponse != null && loginResponse.User != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, loginResponse.User.Username),
                    new Claim("AccessToken", loginResponse.AccessToken),
                    new Claim("DisplayName", loginResponse.User.DisplayName),
                    new Claim("Email", loginResponse.User.Email),
                    new Claim("Avatar", string.IsNullOrEmpty(loginResponse.User.DisplayName) ? "U" : loginResponse.User.DisplayName.Substring(0, 1).ToUpper())
                };

                foreach (var role in loginResponse.User.Roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var principal = new ClaimsPrincipal(identity);

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.Parse(loginResponse.ExpiresAtUtc)
                });

                return RedirectToAction("Dashboard", "Home");
            }

            ModelState.AddModelError(string.Empty, "Invalid username or password.");
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        [HttpGet]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        public IActionResult ForgotPassword(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                ModelState.AddModelError(string.Empty, "Email is required.");
                return View();
            }

            TempData["SuccessMessage"] = "A password reset link has been sent to your email address.";
            return View();
        }

        [HttpGet]
        [Authorize]
        public IActionResult ChangePassword()
        {
            return View();
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ChangePassword(string currentPassword, string newPassword, string confirmPassword)
        {
            if (string.IsNullOrWhiteSpace(currentPassword) || string.IsNullOrWhiteSpace(newPassword))
            {
                ModelState.AddModelError(string.Empty, "All fields are required.");
                return View();
            }

            if (newPassword != confirmPassword)
            {
                ModelState.AddModelError(string.Empty, "Passwords do not match.");
                return View();
            }

            var success = await _authClient.ChangePasswordAsync(currentPassword, newPassword);
            if (success)
            {
                TempData["SuccessMessage"] = "Your password has been changed successfully.";
                return RedirectToAction("Dashboard", "Home");
            }

            ModelState.AddModelError(string.Empty, "Failed to change password. Please check your current password.");
            return View();
        }
    }
}
