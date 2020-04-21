jsonObj2 = {
    "dataColors": [
        "#FF5733",
        "#33FF83",
        "#93FF33"
    ],
    "name": "Test theme",
    "background": "#27450C",
    "foreground": "#BD22A1",
    "tableAccent": "#BD22A1",
    "visualStyles": {
        "*": {
            "*": {
                "*": [
                    {
                        "fontSize": 12,
                        "fontFamily": "Comic Sans MS",
                        "color": {
                            "solid": {}
                        }
                    }
                ]
            }
        }
    }
};

jsonObj = [];
var filename = "My Theme.json";

var models = window['powerbi-client'].models;

function Embed() {
    debugger;
    var inputUrl = document.getElementById("embedUrl").value;
    var sAccessToken = window.accessToken;
    if (inputUrl == "") {
        alert("Please enter a valid Embed URL!")
    }
    else {
        var config = {
            type: 'report',
            accessToken: sAccessToken,
            embedUrl: inputUrl,
            permissions: models.Permissions.ReadWrite
        };

        var $reportContainer = $('#dashboardContainer');
        var report = powerbi.embed($reportContainer.get(0), config);
    }

}

function EmbedWithTheme() {
    createJSON();
    var inputUrl = document.getElementById("embedUrl").value;
    sAccessToken = window.accessToken;
    if (inputUrl == "") {
        alert("Please enter a valid Embed URL!")
    }
    else {
        var config = {
            type: 'report',
            accessToken: sAccessToken,
            embedUrl: inputUrl,
            theme: { themeJson: jsonTheme },
            permissions: models.Permissions.ReadWrite,
        };

        var $reportContainer = $('#dashboardContainer');
        var report = powerbi.embed($reportContainer.get(0), config);
    }

}
function ApplyAndSave() {
    var inputUrl = document.getElementById("embedUrl").value;

    if (inputUrl == "") {
        alert("Please enter a valid Embed URL!")
    }
    else {
        var reportContainer = $('#dashboardContainer')[0];
        // Get a reference to the embedded report.
        report = powerbi.get(reportContainer);
        // Switch to edit mode.
        report.switchMode("edit");
        //save the report in msit
        report.save();
        // Switch to view mode
        report.switchMode("view");
    }
}
function createJSON() {
    jsonObj = [];

    jsonTheme = {
        dataColors: [],
        "textClasses": {
            "title": {
                "fontFace": ""
            },
            "label": {
                "fontFace": ""
            },
            "callout": {
                "fontFace": "",
            }
        }
    };
    $("input[class=themeDataColors]").each(function () {
        var dataColor = $(this).val();
        jsonTheme.dataColors.push(dataColor);
    });
    if ($('#themeName').val() != "") {
        jsonTheme["name"] = $('#themeName').val();
        filename = jsonTheme["name"] + '.json';
    }
    else {
        jsonTheme["name"] = 'My Theme';
    }

    //jsonTheme.dataColors.push($('#themeDataColors').val());
    jsonTheme["background"] = $('#themeBg').val();
    jsonTheme["foreground"] = $('#themeFg').val();
    jsonTheme["tableAccent"] = $('#themeTa').val();

    jsonTheme.textClasses.title.fontSize = $('#titleFontSize').val();
    jsonTheme.textClasses.title.fontFace = $('#titleFontFamily').val();


}
var addButton = $('.add_button');
var wrapper = $('.dataColors');
var fieldHTML = '<input type="text" class="themeDataColors" style="margin-left:18%"  value="#FFFFFF"><button type="submit" id="addButton" onclick="Add()" style="margin-left:1%" >Add</button><br/><br/>';
function Add() {
    //Check maximum number of input fields
    $('#addButton').remove();
    $('.dataColors').append(fieldHTML); //Add field html
}
function download() {
    createJSON();
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonTheme)));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}