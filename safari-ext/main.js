var API_URL_SUBMIT = "https://datacentar.io/app/istinomer-factchecker/api/entry/submit";
var API_URL_GET_CHECKED_FACTS = "https://datacentar.io/app/istinomer-factchecker/api/get-page-fact-check-requests";

var sites = [
    { name: 'Blic', domain: 'blic.rs', css_classes: ['.article-body', '.article-item'], css_elements: ['p', 'h1'] },
    { name: 'Espreso', domain: 'espreso.rs', css_classes: ['.titleWrap', '.articleTxt'], css_elements: ['p', 'h1', 'strong'] },
    { name: 'Kurir', domain: 'kurir.rs', css_classes: ['.articleTxt', '.titleWrap'], css_elements: ['p', 'h1'] },
    { name: 'SrbijaDanas', domain: 'srbijadanas.com', css_classes: ['.article__content-wrapper'], css_elements: ['p', 'h1', 'h2', 'div'] },
    { name: 'Telegraf', domain: 'telegraf.rs', css_classes: ['.article-body'], css_elements: ['p', 'h1', 'h2'] },
    { name: 'N1Info', domain: 'n1info.com', css_classes: ['.single-article'], css_elements: ['h1', 'p'] },
    { name: 'Danas', domain: 'danas.rs', css_classes: ['.site-main'], css_elements: ['h1', 'p'] },
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

