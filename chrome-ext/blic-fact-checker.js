/*Created by egzontina.*/

var API_URL_BLIC = "http://localhost:5000/api/blic/fact/checker";
window.onload = function() {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            var tabUrl = tab.url;
            searchForBlicInCurrentURL(tabUrl,tabId);
        }
    });
};

function searchForBlicInCurrentURL(currentUrl,tabId) {
    var findDomain = "blic.rs";
    if (currentUrl.indexOf(findDomain) != -1){
        retrieveBlicCheckedFacts(currentUrl,tabId);
    }
}

function retrieveBlicCheckedFacts(tabUrl, tabId){
    var data = {currentUrl: tabUrl};
    $.support.cors = true;
    $.ajax({
        type: "POST",
        url: API_URL_BLIC,
        crossDomain: true,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(respData){
            for (var count = 0; count < respData.length; count++) {
                var findCheckedFact = respData[count]["text"];
                var gradeOfCheckedFact = respData[count]["grade"];
                findText(findCheckedFact,gradeOfCheckedFact, tabId);
            }
        },
        error: function(err){
            console.log(JSON.stringify(err));
        }
    });
}


function findText(findCheckedFact,gradeOfCheckedFact, tabId) {
    chrome.tabs.executeScript(tabId, {file: "js/jquery-1.12.0.min.js"}, function () {
        chrome.tabs.executeScript(tabId, {file: "inject-css.js"}, function () {
            chrome.tabs.sendMessage(tabId, {
                scriptOptions: {
                    param1: findCheckedFact,
                    param2: gradeOfCheckedFact
                }
            }, function () {

            });
        });
    });
}