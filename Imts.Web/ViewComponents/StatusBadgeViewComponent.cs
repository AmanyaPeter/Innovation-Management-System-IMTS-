using Microsoft.AspNetCore.Mvc;

namespace Imts.Web.ViewComponents
{
    public class StatusBadgeViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke(string status)
        {
            return View("Default", status ?? string.Empty);
        }
    }
}
