using Microsoft.AspNetCore.Mvc;

namespace Imts.Web.ViewComponents
{
    public class RoleNavViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            var claimsPrincipal = HttpContext.User;
            var role = claimsPrincipal?.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? "Staff";
            return View("Default", role);
        }
    }
}
