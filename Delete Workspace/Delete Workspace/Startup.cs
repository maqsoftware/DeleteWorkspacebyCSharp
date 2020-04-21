using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(DeleteWorkspace.Startup))]
namespace DeleteWorkspace
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {

            ConfigureAuth2(app);
        }
    }
}