// The onClicked callback function.
function onClickHandler(info, tab) {

  chrome.storage.local.get('user_id', function (items) {

    var user_id = items.user_id;
    console.debug('result: ', items.user_id);
    if (user_id) {
      executeRequestWithUserToken(user_id, info, tab);
    }
    else {
      user_id = getRandomToken();
      chrome.storage.local.set(
          {user_id: user_id},
          function () {
            executeRequestWithUserToken(user_id, info, tab);
          }
      );
    }

  });
}
function executeRequestWithUserToken(user_id, info, tab) {

      // Notification Options.
      var success_notification_opt = {
        type: "basic",
        title: "Wait for us!",
        message: "We're fact checking that request for you.",
        iconUrl: "icons/icon-128.png"
      };

      var fail_notification_opt = {
        type: "basic",
        title: "Oh!",
        message: "We're broken, please try again later.",
        iconUrl: "icons/icon-128.png"
      };

      // Generate json data to send to API
      var data = {
        chrome_user_id: user_id,
        url: tab.url,
        text: info.selectionText,
        date: Date.now()
      };

      $.ajax({
        type: "POST",
        url: "http://0.0.0.0:5000/api/factcheck/request",
        data: JSON.stringify(data),
        contentType: "application/json"
      }).done(function () {
          // Success notification
          chrome.notifications.create("success-notification", success_notification_opt);

      }).fail(function () {
        // Failure notification
        chrome.notifications.create("fail-notification", fail_notification_opt);

      });
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

function getRandomToken() {
    // E.g. 8 * 32 = 256 bits token
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    // Return generated user ID
    return hex;
}