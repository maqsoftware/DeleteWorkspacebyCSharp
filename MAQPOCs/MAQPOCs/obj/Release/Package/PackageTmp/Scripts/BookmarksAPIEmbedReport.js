/// <disable>JS2032, JS2074, JS3058, JS2076, JS2024, JS3092</disable>
"use strict";
var oCommon = {};
var startTime;
var endTime;
var Time;
var show = '';
var token = '';
var x = location.search.toString();
var reportid = x.split('&')[0].split('=')[1];
var pagesarr = [];
var txtAccessToken;
var models = window['powerbi-client'].models;
var permissions = models.Permissions.All;
var embedConfiguration;
var tokenTime = 0;
var i = 0;
var config;
var $embedprint;
var printreport;
var capturedBookmark;
var greport;
// ADAL configuration object
//oCommon.config = {
//    instance: "https://login.microsoftonline.com/",
//    tenant: "e4d98dd2-9199-42e5-ba8b-da3e763ede2e",
//    clientId: "d4278e27-2bce-46a6-9c2b-f1a491800a8c",
//    postLogoutRedirectUri: window.location.origin,
//    cacheLocation: "localStorage",
//};

//// Authentication context
//oCommon.authContext = new AuthenticationContext(oCommon.config);
//var bIsCallback = oCommon.authContext.isCallback(window.location.hash);
//oCommon.authContext.handleWindowCallback();

//// Log any error if during login
//oCommon.loginError = oCommon.authContext.getLoginError();
//if (oCommon.loginError) {
//    console.log(oCommon.loginError);
//    oCommon.authContext.login();
//}

//// Redirect user to login
//if (bIsCallback && !oCommon.authContext.getLoginError()) {
//    window.location = oCommon.authContext._getItem("adal.login.request");
//}

//// Check Login Status

//oCommon.user = oCommon.authContext.getCachedUser();
//console.log(oCommon)
let sToken = document.cookie.substr(document.cookie.indexOf('=') + 1);
//oCommon.authContext.acquireToken("https://analysis.windows.net/powerbi/api",
mainFunc(sToken);
 function mainFunc(sToken) {
    tokenTime = Date.now();
    //console.log(sToken)
    //// Handle ADAL Errors
    //if (oError || !sToken) {
    //    console.log("ADAL Error Occurred: " + oError);
    //    // Handle error
    //    oCommon.authContext.login();
    //    return;
    //}
    // embed using sToken
    var txtAccessToken = sToken;
    startTime = Date.now();

    var models = window['powerbi-client'].models;
    var permissions = models.Permissions.All;
    //var viewMode = models.ViewMode.Edit;
    var embedConfiguration = {
        type: 'report',
        tokenType: models.TokenType.Aad,
        accessToken: sToken,
        embedUrl: 'https://app.powerbi.com/reportEmbed' + x,
        id: reportid,
        permissions: models.Permissions.ReadWrite,
        viewMode: models.ViewMode.View

    };
    var $reportContainer = $('#dashboardContainer');
    var report = powerbi.embed($reportContainer.get(0), embedConfiguration);
    greport = report;
    report.on("loaded", () => {
        let bookmarks = report.bookmarksManager.getBookmarks();
        bookmarks.then((res) => {
            var select = document.getElementById("reportDropdown");
            for (var i = 0; i < res.length; i++) {
                var option = document.createElement('option');
                option.text = res[i].displayName;
                option.value = res[i].state;
                select.add(option);
            }
        })
        .catch((err) => {
            console.log(err);
        });
        var resState;
        $('.saveBookmark').on('click', function () {
            var newBookmark = (report.bookmarksManager.capture());
            newBookmark.then(res => {
                debugger;
                var option = document.createElement('option');
                option.text = $('.bookmarkName')[0].value || res.displayName;
                option.value = res.state;
                document.getElementById("sessionDropdown").add(option);
                alert('Bookmark has been Saved');
            });
        });
        $('.reportDropdown').on('change', function () {
            var state = $('.reportDropdown')[0].value;
            if (state === 'none') {
                report.reload();
            } else {
                report.bookmarksManager.applyState(state);
            }
        });
        $('.sessionDropdown').on('change', function () {
            var state = $('.sessionDropdown')[0].value;
            if (state === 'none') {
                report.reload();
            } else {
                report.bookmarksManager.applyState(state);
            }
        });
    });

};