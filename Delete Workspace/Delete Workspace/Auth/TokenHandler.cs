namespace DeleteWorkspace.Auth
{
    //using Microsoft.Identity.Client;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using Microsoft.Owin.Security.Notifications;
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web;

    public class TokenHandler
    {
        public static async Task setTokenAsync(AuthorizationCodeReceivedNotification context)
        {
            var code = context.Code;
            ClientCredential credential = new ClientCredential(AuthConstants.CLIENT_ID, AuthConstants.APP_KEY);
            string userObjectID = context.AuthenticationTicket.Identity.FindFirst(AuthConstants.claimIdentifier).Value;
            AuthenticationContext authContext = new AuthenticationContext(AuthConstants.AUTHORITY, true);

            Uri uri = new Uri(HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path));
            AuthenticationResult result = await authContext.AcquireTokenByAuthorizationCodeAsync(code, uri, credential, AuthConstants.powerBIResourceId);
            string AccessToken = result.AccessToken;

            HttpCookie myCookie = new HttpCookie(AuthConstants.accessCookie);
            // Set the cookie value.
            myCookie.Value = AccessToken;
            // Set the cookie expiration date time.
            DateTime now = DateTime.Now;
            myCookie.Expires = now.AddMinutes(58);
            // Add the cookie.
            HttpContext.Current.Response.Cookies.Add(myCookie);

            HttpContext.Current.Session.Add(AuthConstants.accessToken, AccessToken);
            // Set the session expiration time
            HttpContext.Current.Session.Timeout = 58; //minutes 
        }

        public static string getAccessToken()
        {
            try
            {
                var token = HttpContext.Current.Session[AuthConstants.accessToken];
                if (token == null)
                {
                    HttpCookie reqCookies = HttpContext.Current.Request.Cookies[AuthConstants.accessCookie];
                    if (reqCookies != null)
                    {
                        token = reqCookies[AuthConstants.accessToken];
                    }
                    else token = "";
                }
                return token.ToString();
            }
            catch (Exception)
            {
                return "";
            }
        }

    }
}