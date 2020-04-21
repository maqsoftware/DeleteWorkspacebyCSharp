using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(MAQPOCs.Startup))]
namespace MAQPOCs
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {

            ConfigureAuth2(app);
        }
    }
}