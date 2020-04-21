using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;

namespace DeleteWorkspace.Controllers
{
    public class HomeController : Controller
    {/// <summary>
     /// Send an OpenID Connect sign-in request.
     /// Alternatively, you can just decorate the SignIn method with the [Authorize] attribute
     /// </summary>
        public ActionResult SignIn()
        {
            HttpContext.GetOwinContext().Authentication.Challenge(
                    new AuthenticationProperties { RedirectUri = "/" },
                    OpenIdConnectAuthenticationDefaults.AuthenticationType);
            return new HttpUnauthorizedResult();
        }

        /// <summary>
        /// Send an OpenID Connect sign-out request.
        /// </summary>
        public ActionResult SignOut()
        {
            HttpContext.GetOwinContext().Authentication.SignOut(
                OpenIdConnectAuthenticationDefaults.AuthenticationType,
                CookieAuthenticationDefaults.AuthenticationType);
            return new HttpUnauthorizedResult();
        }

        public ActionResult PostSignout()
        {
            Session.Clear();
            return View("Signout");
        }
        public ActionResult Index()
        {

            if (!Request.IsAuthenticated)
            {
                //redirect user to sign in page
                return SignIn();
            }

            string emailId = string.Empty, username = string.Empty;
            try
            {
                username = ((ClaimsIdentity)System.Web.HttpContext.Current.User.Identity).FindFirst("name").Value;
                emailId = System.Web.HttpContext.Current.User.Identity.Name;
                ViewBag.username = username;
                ViewBag.useremailId = emailId;

                string Accesstoken = Auth.TokenHandler.getAccessToken();
                if (string.IsNullOrEmpty(Accesstoken))
                {
                    return SignIn();
                }
            }
            catch (Exception)
            {
                return RedirectToAction("ErrorLogin", "Home");
            }

            return View();
        }
        public string getAccessToken()
        {
            if (!Request.IsAuthenticated)
            {
                //redirect user to sign in page
                SignIn();
            }

            string accToken = Auth.TokenHandler.getAccessToken();
            return accToken;
        }
    }
}