// The onClicked callback function.
function onClickHandler(info, tab) {
  var data = {
    date: Date.now(),
  	url: tab.url,
  	text: info.selectionText
  };

  $.ajax({
    type: "POST",
    url: "http://0.0.0.0:5000/api/factcheck/request",
    data: JSON.stringify(data),
    contentType: "application/json"
  }).done(function(data) {
    chrome.notifications.create("success-notification", success_notification_opt);
  }).fail(function() {
    chrome.notifications.create("fail-notification", fail_notification_opt);
  });
};

// Notification Options.
var success_notification_opt = {
  type: "basic",
  title: "Wait for us!",
  message: "We're fact checking that request for you.",
  iconUrl: "icons/icon-128.png"
}

var fail_notification_opt = {
  type: "basic",
  title: "Oh!",
  message: "We're broken, please try again later.",
  iconUrl: "icons/icon-128.png"
}


// Context Menu.
chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function() {
  var id = chrome.contextMenus.create({
    "title": "Istina?",
    "contexts":["selection"],
    "id": "istinomer"
  });
});
