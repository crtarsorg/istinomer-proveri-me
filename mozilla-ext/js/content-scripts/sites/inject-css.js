/** Hightlight factcheck logic implementation for blic.rs **/


var API_URL_GET_CHECKED_FACTS = "https://datacentar.io/app/istinomer-factchecker/api/get-page-fact-check-requests";
//var API_URL_GET_CHECKED_FACTS = "http://0.0.0.0:5000/api/get-page-fact-check-requests";
var currentTabUrl = window.location.href;

var greenList = ['Half true', 'Mostly true', 'True', 'Consistent', 'In progress', 'Almost fulfilled', 'Fulfilled'];
var yellowList = ['Stalled', 'In between'];
var redList = ['Pants on fire', 'False', 'Not started', 'Unfulfilled', 'Unbelievable', 'Abuse of facts', 'Inconsistent', 'Mostly false'];

function getHighlightClassBasedOnGrade(value) {
    if ($.inArray(value, greenList) >= 0) {
        return "light-green";
    }
    else if ($.inArray(value, yellowList) >= 0) {
        return "yellow";
    }
    else if ($.inArray(value, redList) >= 0) {
        return "red";
    }
    else {
        return "light-grey";
    }
}

function styleFactCheckRequest(statement, grade) {
    sites.forEach(site => {
        if (currentTabUrl.includes(site.domain)) {
            $(site.css_classes.join()).find(site.css_elements.join()).each(function () {
                var str = $(this).text();
                if (str.indexOf(statement) !== -1) {
                    $(this).html(
                        $(this).html().replace(statement, "<span class=" + getHighlightClassBasedOnGrade(grade) + "> $& </span><span id='grade-logo-factchecker'></span>")
                    );
                }
            });
        }

    })



}

$(document).ready(function () {
    chrome.storage.local.get('user_data', function (items) {
        const respData = items.user_data;
        for (var index = 0; index < respData.length; index++) {
            if (respData[index]['url'] == currentTabUrl) {
                var statement = respData[index]["text"];
                var grade = respData[index]["grade"];
                styleFactCheckRequest(statement, grade);
            }
        }
    });

});


