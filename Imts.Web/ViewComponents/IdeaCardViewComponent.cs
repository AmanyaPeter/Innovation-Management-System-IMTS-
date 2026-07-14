using Microsoft.AspNetCore.Mvc;
using Imts.Web.Services;

namespace Imts.Web.ViewComponents
{
    public class IdeaCardViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke(IdeaResponse idea)
        {
            return View("Default", idea);
        }
    }
}
