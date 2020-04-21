let groupArray = [];
let emptyWorkspaceIds = [];
let accessToken;
let errorFlag = false;
async function getAccess()  {
    accessToken = document.cookie.substr(document.cookie.indexOf('accessCookie=') + 13);
    let isAdmin = document.querySelector('#adminCheckBox').checked;
    let groupInitString = isAdmin? "https://api.powerbi.com/v1.0/myorg/admin/groups?$top=5000":"https://api.powerbi.com/v1.0/myorg/groups";
    let reportInitString = isAdmin? "https://api.powerbi.com/v1.0/myorg/admin/groups/":"https://api.powerbi.com/v1.0/myorg/groups/";
    getGroups(accessToken,groupInitString,reportInitString);
};

const getGroups = (token, groupInitString, reportInitString) => {
    let header = new Headers();
    header.append("Authorization", `Bearer ${token}`);
    fetch(groupInitString, { //normal call
        headers: header
    }).then(res=> {
        res.json().then(groups => {
            let group = groups;
            getReports(header,group,reportInitString);
        })
    }).catch(() => {
        errorFlag = true;
        alert('Cannot fetch data, Redirecting...');
        window.location.reload();
    });
};

function getReports(header,group,reportInitString){
    let appendCount = 0;
    for (let i = 0; i < group.value.length; i++) {
        fetch(reportInitString + group.value[i].id + "/reports", { //normal call
            headers: header
        }).then(reportList=> {
            reportList.json().then(reports=> {
                group.value[i].isEmpty = reports.value.length? false: true;
                groupArray.push(group.value[i]);
                appendCount++;
                if (appendCount === group.value.length - 1) {
                    AppendTable(groupArray);
                }
            });
        }).catch(() => {
            errorFlag = true;
            alert('Cannot fetch data, Redirecting...');
            window.location.reload();
        });
    }
}

function AppendTable(gArray) {
    let count = 0;
    let table = document.querySelector('.list-groups table');
    for (let iterator = 0; iterator < gArray.length; iterator++) {
        if (gArray[iterator].isEmpty) {
            emptyWorkspaceIds.push(gArray[iterator].id);
            count++;
            let trEle = document.createElement('tr');
            trEle.setAttribute('class', 'workspaces');
            trEle.setAttribute('id', `rownum${iterator}`);
            let tdEle1 = document.createElement('td');
            tdEle1.innerHTML = gArray[iterator].name;
            trEle.appendChild(tdEle1);
            let tdEle2 = document.createElement('td');
            tdEle2.innerHTML = 'Yes';
            trEle.appendChild(tdEle2);
            let button = document.createElement('button');
            button.innerText = "Delete";
            tdEle2.appendChild(button);
            table.appendChild(trEle);
            button.addEventListener('click', () => { deleteWS(gArray[iterator].id, iterator); });
        }
        else {
            let trEle = document.createElement('tr');
            trEle.setAttribute('class', 'workspaces');
            trEle.setAttribute('id', `rownum${iterator}`);
            let tdEle1 = document.createElement('td');
            tdEle1.innerHTML = groupArray[iterator].name;
            trEle.appendChild(tdEle1);
            let tdEle2 = document.createElement('td');
            tdEle2.innerHTML = 'No';
            trEle.appendChild(tdEle2);
            table.appendChild(trEle);
        }
    }
    let radioCheck = document.querySelector('#adminCheck');
    let deleteAllButton = document.querySelector('#deleteAll');
    radioCheck.style.display = 'inline-block';
    deleteAllButton.style.display = 'inline-block';
}
function deleteWS(groupId, rowNumber) {
    let header = new Headers();
    header.append("Authorization", `Bearer ${accessToken}`);
    var requestOptions = {
        method: 'DELETE',
        headers: header,
        redirect: 'follow'
    };
    fetch("https://api.powerbi.com/v1.0/myorg/groups/" + groupId, requestOptions)
  .then(response => response.text())
  .then(() => {
      document.getElementById(`rownum${rowNumber}`).remove();
  })
  .catch(error => console.log('error', error));
}
function impFunctions() {
    let radioCheck = document.querySelector('#adminCheck');
    let deleteAllButton = document.querySelector('#deleteAll');
    radioCheck.style.display = 'inline-block';
    deleteAllButton.style.display = 'inline-block';
    radioCheck.addEventListener('change', () => {
        radioCheck.style.display = 'none';
        deleteAllButton.style.display = 'none';
        let allRows = document.getElementsByClassName('workspaces');
        while (allRows.length > 0) {
            allRows[0].remove();
        }
        groupArray = [];
        errorFlag = false;
        getAccess();
    });
    deleteAllButton.addEventListener('click', () => {
        if (emptyWorkspaceIds.length = 0) {
            for (let i = 0; i < emptyWorkspaceIds.length; i++) {
                deleteWS(emptyWorkspaceIds[i]);
            }
        }
        else {
            alert("No empty Workspace found");
        }
    });
}
getAccess().then(()=>{impFunctions();});