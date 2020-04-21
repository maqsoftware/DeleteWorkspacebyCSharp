# Delete Power BI Workspaces
The solution aims to find Empty Workspaces and providing users the option to delete them.
## How to Use
1. Download/clone the repository.
2. Open the sln file in visual studio and build the solution. This will download all the packages required.
3. Edit the tags with 'clientID' and 'appkey' in web.config file. Here is how you can get these details: [Create AAD app](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal),
[Grant admin consent](https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/grant-admin-consent)
4. Run the solution in any browser and log in with your O365 account.
5. After consent for permissions, you will be redirected to a screen with details of your workspaces.
