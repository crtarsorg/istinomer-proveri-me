/*Created by egzontina.*/

var API_URL_BLIC = "http://localhost:5000/api/blic/fact/checker";
window.onload = function() {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            var tabUrl = tab.url;
          searchForBlicInCurrentURL(tabUrl);

        }
    });
};

function searchForBlicInCurrentURL(currentUrl) {
    var findDomain = "blic.rs";
    if (currentUrl.indexOf(findDomain) != -1){
        retrieveBlicCheckedFacts(currentUrl);

    }
}

function retrieveBlicCheckedFacts(tabUrl){
    var data = {currentUrl: tabUrl};
    $.support.cors = true;
    $.ajax({
        type: "POST",
        url: API_URL_BLIC,
        crossDomain: true,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data){
            console.log(data);
            findTextInsideParagraphs(data);
        },
        error: function(err){
            console.log(JSON.stringify(err));
        }
    });
}


function findTextInsideParagraphs(respData){
        $("#detail").find('p').each(function() {
          for (var count = 0; count < respData.length; count++) {
            var findCheckedFact = respData[count]["text"];
            var str = $(this).text();
            console.log(str);
            if (str.indexOf(findCheckedFact) >= 0) {
                $(this).html(
                    $(this).html().replace(findCheckedFact, "<span class="+getColorBasedOnCategory(respData[count]["grade"]) +"> $& </span>")
              );
            }
          }
        })
}
function getColorBasedOnCategory(value){
    var greenList = ['Half true', 'Mostly true', 'True', 'Consistent', 'In progress', 'Almost fulfilled', 'Fulfilled'];
    var yellowList = ['Stalled','In between'];
    var redList = ['Pants on fire','False', 'Not started', 'Unfulfilled', 'Inconsistent', 'Mostly false'];

    if($.inArray( value, greenList )>=0){
        return  "light-green";
    }
    else if($.inArray( value, yellowList )>=0){
        return  "yellow";
    }
    else if($.inArray( value, redList )>=0){
        return  "red";
    }
    else {
        return "light-grey";
    }
}

