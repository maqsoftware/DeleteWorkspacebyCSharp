namespace DeleteWorkspace
{
    using DeleteWorkspace.Auth;
    using Microsoft.IdentityModel.Tokens;
    using Microsoft.Owin.Extensions;
    using Microsoft.Owin.Security;
    using Microsoft.Owin.Security.Cookies;
    using Microsoft.Owin.Security.Notifications;
    using Microsoft.Owin.Security.OpenIdConnect;
    using Owin;
    using System.Threading.Tasks;

    public partial class Startup
    {
        /// <summary>
        ///The Client ID is used by the application to uniquely identify itself to Azure AD.
        ///The Metadata Address is used by the application to retrieve the signing keys used by Azure AD.
        ///The AAD Instance is the instance of Azure, for example public Azure or Azure China.
        ///The Authority is the sign-in URL of the tenant.
        ///The Post Logout Redirect Uri is the URL where the user will be redirected after they sign out.
        /// </summary>
        /// <param name="app"></param>
        public void ConfigureAuth2(IAppBuilder app)
        {
            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);
            app.UseCookieAuthentication(new CookieAuthenticationOptions());
            app.UseOpenIdConnectAuthentication(
                new OpenIdConnectAuthenticationOptions
                {
                    ClientId = AuthConstants.CLIENT_ID,
                    Authority = AuthConstants.AUTHORITY,
                    ResponseType = "code id_token",
                    TokenValidationParameters = new TokenValidationParameters
                    {
                        SaveSigninToken = true,
                        ValidateIssuer = false
                    },
                    Notifications = new OpenIdConnectAuthenticationNotifications()
                    {
                        AuthorizationCodeReceived = OnAuthorizationCodeReceived,
                        RedirectToIdentityProvider = (context) =>
                        {
                            string appBaseUrl = $"{context.Request.Scheme}://{context.Request.Host}{context.Request.PathBase}/";
                            context.ProtocolMessage.RedirectUri = appBaseUrl;

                            AuthConstants.POST_SIGNOUT_REDIRECT_URL = AuthConstants.POST_SIGNOUT_REDIRECT_URL.IndexOf("/") == 0 ?
                            AuthConstants.POST_SIGNOUT_REDIRECT_URL.Remove(0, 1) : AuthConstants.POST_SIGNOUT_REDIRECT_URL;

                            context.ProtocolMessage.PostLogoutRedirectUri = $"{appBaseUrl}{AuthConstants.POST_SIGNOUT_REDIRECT_URL}";

                            //if (context.Request.Headers.ContainsKey("X-Requested-With") && context.Request.Headers["X-Requested-With"] == "XMLHttpRequest")
                            //{
                            //	context.HandleResponse();
                            //	context.Response.StatusCode = 403;
                            //	context.Response.Headers.Remove("Set-Cookie");
                            //}
                            return Task.FromResult(0);
                        },
                        AuthenticationFailed = context =>
                        {
                            context.HandleResponse();
                            string appBaseUrl = $"{context.Request.Scheme}://{context.Request.Host}{context.Request.PathBase}/";
                            context.Response.Redirect($"{appBaseUrl}/home/ErrorLogin?message=" + context.Exception.Message);
                            return Task.FromResult(0);
                        }
                    }
                });
            //app.UseStageMarker(PipelineStage.Authenticate);
        }

        /// <summary>
        /// adds access token in current context after authorization
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private async Task OnAuthorizationCodeReceived(AuthorizationCodeReceivedNotification context)
        {
            await Auth.TokenHandler.setTokenAsync(context);
        }
    }
}