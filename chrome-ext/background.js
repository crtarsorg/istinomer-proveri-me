/** Context menu and factcheck logic implementation. **/

var API_URL_SUBMIT = "https://datacentar.io/app/istinomer-factchecker/api/entry/submit";
// var API_URL_SUBMIT = "http://0.0.0.0:5000/api/entry/submit";

// Set chrome extension params and config
chrome.runtime.onInstalled.addListener(function () {
  var id = chrome.contextMenus.create({
    "title": "Proveri me!",
    "contexts": ["selection"],
    "id": "istinomer"
  });
});

// Context Menu and event listener to send fact check entries
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  callDataProvider(info, tab);
});

// Data Provider function with token checker
function callDataProvider(info, tab) {
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
        { user_id: user_id },
        function () {
          // Execute request to API server
          executeRequestWithUserToken(user_id, info, tab);
        }
      );
    }
  });
}

// Callback function to retrieve data from API
function executeRequestWithUserToken(user_id, info, tab) {

  let textFound = false;
  let foundSite = false;

  sites.forEach(site => {
    if (tab.url.includes(site.domain)) {
      foundSite = true;
    }
  });

  if (!foundSite) {
    chrome.notifications.create("site-notification", {
      type: "basic",
      title: "Oh!",
      message: "Istinomer Proveri me! aplikacija ne radi na ovom sajtu!",
      iconUrl: "icons/icon-128.png"
    });
    return;
  }

  // Notification options.
  var success_notification_opt = {
    type: "basic",
    title: "Da se ne lažemo",
    message: "Poslato Istinomeru. Odgovor stiže nakon provere.",
    iconUrl: "icons/icon-128.png"
  };

  var fail_notification_opt = {
    type: "basic",
    title: "Oh!",
    message: "Sajt je nedostupan, molim vas pokušajte kasnije.",
    iconUrl: "icons/icon-128.png"
  };

  // Generate json data to send to API
  var data = {
    version: 3,
    chrome_user_id: user_id,
    url: tab.url,
    text: info.selectionText,
    date: Date.now(),
    classification: "Backlog"
  };

  // Retrieve data from local storage, otherwise retrieve them from database
  chrome.storage.local.get('user_data', async function (items) {



    var user_factcheck_requests = items.user_data;
    for (let i = 0; i < user_factcheck_requests.length; i++) {
      if (user_factcheck_requests[i].text == data.text) {
        textFound = true;
        break;
      }
    }

    if (textFound) {
      chrome.notifications.create("exists-notification", {
        type: "basic",
        title: "Oh!",
        message: "Već ste obeležili ovaj tekst ranije!",
        iconUrl: "icons/icon-128.png"
      });
      return;
    }


    $.ajax({
      type: "POST",
      url: API_URL_SUBMIT,
      data: JSON.stringify(data),
      contentType: "application/json"
    }).done(function () {
      // Success notification
      chrome.notifications.create("success-notification", success_notification_opt);

    }).fail(function (e) {
      console.log(e);
      // Failure notification
      chrome.notifications.create("fail-notification", fail_notification_opt);

    });

    if (user_factcheck_requests) {
      user_factcheck_requests.push(data);
      chrome.storage.local.set({ user_data: user_factcheck_requests }, function () { });
    }
    else {
      //Save the response data to a local storage, so that we dont need to interact with API server every time
      chrome.storage.local.set({ user_data: [data] }, function () { });
    }
  });



}

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
