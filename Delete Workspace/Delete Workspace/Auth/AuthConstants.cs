namespace DeleteWorkspace.Auth
{
    using System;
    using System.Configuration;
    using System.Globalization;

    public class AuthConstants
    {

        public static string CLIENT_ID = ConfigurationManager.AppSettings["clientID"];
        public static string APP_KEY = ConfigurationManager.AppSettings["appkey"];
        public static string TENANT = ConfigurationManager.AppSettings["tenant"];
        public static string AAD_INSTANCE = ConfigurationManager.AppSettings["aadInstance"];
        public static string AUTHORITY = String.Format(CultureInfo.InvariantCulture, AAD_INSTANCE, TENANT);
        public static string POST_SIGNOUT_REDIRECT_URL = ConfigurationManager.AppSettings["postSignoutRedirectUrl"];
        public static string claimIdentifier = ConfigurationManager.AppSettings["claimIdentifier"];
        public static string powerBIResourceId = ConfigurationManager.AppSettings["PowerBIResourceId"];
        public static string accessCookie = "accessCookie";
        public static string accessToken = "accessToken";

    }
}