
var greenList = ['Half true', 'Mostly true', 'True', 'Consistent', 'In progress', 'Almost fulfilled', 'Fulfilled'];
var yellowList = ['Stalled','In between'];
var redList = ['Pants on fire','False', 'Not started', 'Unfulfilled', 'Inconsistent', 'Mostly false', 'Abuse of facts', 'Unbelievable'];

if (window.top === window) {
    safari.self.addEventListener("message", handleMessage, false);

    function handleMessage(msgEvent) {
        var messageName = msgEvent.name;
        var messageData = msgEvent.message;
    
        if (messageName === 'updatehtml') {
            var respData = messageData.respData;
            var site = messageData.site;
            for (var index = 0; index < respData.length; index++) {
                    var statement = respData[index]["text"];
                    var grade = respData[index]["grade"];
                    styleFactCheckRequest(site, statement, grade);
            }
            
        }  
    }
    


function getHighlightClassBasedOnGrade(value){
    if(greenList.indexOf(value) >= 0){
        return  "light-green";
    }
    else if(yellowList.indexOf(value) >= 0){
        return  "yellow";
    }
    else if(redList.indexOf(value) >= 0){
        return  "red";
    }
    else {
        return "light-grey";
    }
}

function styleFactCheckRequest(site, statement, grade) {
   
    var elems = document.querySelectorAll(site.css_classes.join());
    Array.prototype.forEach.call(elems, function(el, i) {
        var str = el.textContent;
        if (str.indexOf(statement) !== -1) {
            el.innerHTML = el.innerHTML.replace(statement, "<span class=" + getHighlightClassBasedOnGrade(grade) + "> $& </span><span id='grade-logo-factchecker'></span> ");
        }
    });
}
}
    
    
    
