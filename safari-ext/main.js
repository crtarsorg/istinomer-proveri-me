var API_URL_SUBMIT = "http://0.0.0.:3000/api/entry/submit";
var API_URL_GET_CHECKED_FACTS = "http://0.0.0.0:3000/api/get-page-fact-check-requests";

var sites = [
    {name: 'Telegrafi', domain: 'telegrafi.com', css_classes: ['.article-title', '.article-area'], elements: ['h1','p'] }
]

safari.application.addEventListener("command", function(event) {
    if (event.command == 'contextmenu') {
    safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("setselectiontext");
    }
} ,false)




safari.application.addEventListener('message', handleMessage, false);

function handleMessage(msg) {
    if (msg.name === 'selectedText' && currentSiteValidation()) {
        let userId = localStorage.getItem('userId');

        if(userId) {
            executeRequestWithUserToken(msg.message, userId);
        } else {
            userId = Math.random().toString(36);
            localStorage.setItem('userId', userId);
            executeRequestWithUserToken(msg.message, userId);
        }
        
    }
}

function currentSiteValidation() {
    
    return sites.some(function(site) {
        return safari.application.activeBrowserWindow.activeTab.url.includes(site.domain);
    });
}


function executeRequestWithUserToken(text, userId) {
    var data = {
        version: 2,
        chrome_user_id: userId,
        url: safari.application.activeBrowserWindow.activeTab.url,
        text: text,
        date: Date.now(),
        classification: "Backlog"
      };


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

      $.ajax({
        type: "POST",
        url: API_URL_SUBMIT,
        data: JSON.stringify(data),
        contentType: "application/json"
      }).done(function () {
        alert(success_notification_opt.title + '\n' + success_notification_opt.message);
      }).fail(function () {
        alert(fail_notification_opt + '\n' + fail_notification_opt.message);
      });
}


safari.application.addEventListener("navigate", function() {
sites.forEach(site => {
    if (safari.application.activeBrowserWindow.activeTab.url.includes(site.domain)) {
        var data = {currentUrl: safari.application.activeBrowserWindow.activeTab.url};
        $.ajax({
            type: "POST",
            url: API_URL_GET_CHECKED_FACTS,
            crossDomain: true,
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(respData){
                var data = {
                    site: site,
                    respData: respData
                }
                safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("updatehtml", data);
            },
            error: function(err){
                console.error("Unexpected error while trying to retrieve fact-checking requests for " + site.domain);
            }
        });
    }
});
}, true);

