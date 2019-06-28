
if (window.top === window) {

safari.self.addEventListener("message", handleMessage, false);

function handleMessage(msgEvent) {
    var messageName = msgEvent.name;
    var messageData = msgEvent.message;

    if (messageName === "setselectiontext") {
        var sel = window.getSelection()+'';
        safari.self.tab.dispatchMessage('selectedText', sel);
    } 
}
}



