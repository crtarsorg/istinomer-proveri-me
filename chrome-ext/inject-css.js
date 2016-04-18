
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var scriptOptions = message.scriptOptions;
    try_and_replace_fact (scriptOptions.param1, scriptOptions.param2);
});

function try_and_replace_fact (findCheckedFact, gradeOfCheckedFact) {
    $("#lead,#detail").find('p').each(function () {
        var str = $(this).text();
        console.log("Paragraph: ", str);
        if (str.indexOf(findCheckedFact) !== -1) {
            console.log ("str indexOf " , str.indexOf(findCheckedFact) );
            $(this).html(
                $(this).html().replace(findCheckedFact, "<span class=" + getColorBasedOnCategory(gradeOfCheckedFact) + "> $& <span id='grade-logo-factchecker'></span></span> ")
            );
        }
    });
}
function getColorBasedOnCategory(value){
    var greenList = ['Half true', 'Mostly true', 'True', 'Consistent', 'In progress', 'Almost fulfilled', 'Fulfilled'];
    var yellowList = ['Stalled','Ins between'];
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

