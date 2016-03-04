// The onClicked callback function.
function onClickHandler(info, tab) {

  chrome.storage.local.get('user_id', function (items) {

    // Get user Id from local storage if it exists, otherwise generate one
    var user_id = items.user_id;
    if (user_id) {
      // Execute request to API server
      executeRequestWithUserToken(user_id, info, tab);
    }
    else {
      user_id = getRandomToken();
      chrome.storage.local.set(
          {user_id: user_id},
          function () {
            // Execute request to API server
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

// Set chrome extension params and config
chrome.runtime.onInstalled.addListener(function() {
  var id = chrome.contextMenus.create({
    "title": "Istina?",
    "contexts":["selection"],
    "id": "istinomer"
  });
});

function getRandomToken() {
    // Use chrome crypto method to generate a random value
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var token = '';
    for (var i = 0; i < randomPool.length; ++i) {
        token += randomPool[i].toString(16);
    }
    // Return generated user ID
    return token;
}

//chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
//chrome.browserAction.setBadgeText({text: 'your text'});