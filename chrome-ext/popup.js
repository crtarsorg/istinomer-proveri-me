/** Popup content provider logic. **/

document.addEventListener("DOMContentLoaded", function () {

    // Retrieve data from local storage, otherwise retrieve them from database
    chrome.storage.local.get('user_data', function(items){

        var user_factcheck_requests = items.user_data;
        if (user_factcheck_requests){
            // Call the function to build HTML DOM on callback response
            buildHTML(user_factcheck_requests);
            // Add the badge to the extension icon
            chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
            chrome.browserAction.setBadgeText({text: ''});
        }
        else{
            // get all user notification
            updateNotificationBox();
        }
    });
  });

function updateNotificationBox(){
    chrome.storage.local.get('user_id', function (items) {

    // Get user Id from local storage if it exists, otherwise generate one
    var user_id = items.user_id;
    if (user_id) {
      // Execute request to API server
      retrieveDataWithUserToken(user_id);
    }
    else {
      user_id = getRandomToken();
      chrome.storage.local.set(
          {user_id: user_id},
          function () {
            // Execute request to API server
            retrieveDataWithUserToken(user_id);
          }
      );
    }
  });
}

function retrieveDataWithUserToken(user_id){

    $.ajax({
        type: "POST",
        url: "http://opendatakosovo.org/app/istinomer-factcheckr/api/entry/get",
        data: JSON.stringify({chrome_user_id: user_id}),
        contentType: "application/json"
      }).done(function (respData) {

        // Build HTML DOM on update
        buildHTML(respData);

        //Save the response data to a local storage, so that we dont need to interact with API server every time
        chrome.storage.local.set({user_data: respData});

      }).fail(function () {
        var fail_notification_opt = {
            type: "basic",
            title: "Oh!",
            message: "We're broken, please try again later.",
            iconUrl: "icons/icon-128.png"
          };
        // Failure notification
        chrome.notifications.create("fail-notification", fail_notification_opt);

      });

}

function buildHTML(respData){

    // Empty current items from the
    $('.list-group-factcheckr').empty();

    var notification_cnt = 0;
    $.each(respData, function(index, item){
        var grade;
        if(item['grade']){
            grade = item['grade'];
            notification_cnt++;
        }
        else{
            grade = "N/A";
        }

        if(item['inappropriate']){

            // if the content were flagged as inappropriate inject this html element to DOM
            notification_cnt++;
            $('.list-group-factcheckr').append(
                "<li>"+
                    "<div class='popUpStories'>" +
                        "<p class='itemTxt'>"+ item['text'] + "</p>" +
                        "<div style='display: inline-block;float: right;margin-right:7px;'>"+
                            "<a class='spanLink' style='padding: 5px' href='"+ item['url'] + "' target='_blank'>" + item['domain'] + "</a>" +
                            "<span class='evalMark' style='padding: 5px; margin:3px'>" + "Inappropriate" +"</span>" +
                        "</div>" +
                    "</div><br>" +
                    "<div>"+
                        "<b>Reason: </b>" + "<i>" + item['inappropriate'] + "</i>" +
                    "</div><br>" +
                "</li>"
            );
        }
        else{
            $('.list-group-factcheckr').append(
                "<li>"+
                    "<div class='popUpStories'>" +
                        "<p class='itemTxt'>"+ item['text'] + "</p>" +
                        "<div style='display: inline-block;float: right;margin-right:7px;'>"+
                            "<a class='spanLink' style='padding: 5px' href='"+ item['url'] + "' target='_blank'>" + item['domain'] + "</a>" +
                            "<span class='evalMark' style='padding: 5px; margin:3px'>" + item['mark'] + "</span>" +
                            "<span class='spanGrade' style='padding: 5px; margin:3px'>" + grade + "</span>" +
                        "</div>" +
                    "</div><br>" +
                "</li>"
            );
        }

    });

    var ntf_txt;
    // create notification based on the response we got
    chrome.storage.local.get('ntf_cnt', function(notifications){
        var ntf_number = notifications.ntf_cnt;
        if(ntf_number){
            var tmp_cnt = notification_cnt - ntf_number;
            if(tmp_cnt > 0) {
                ntf_txt = tmp_cnt.toString();
            }
        }
        else{
            if(notification_cnt == 0){
                ntf_txt = '';
            }
            else{

                ntf_txt = notification_cnt.toString();
            }
        }

        // store it for the next session
        chrome.storage.local.set({ntf_cnt: notification_cnt});
        // Add the badge to the extension icon
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        chrome.browserAction.setBadgeText({text: ntf_txt});
    });


}

// Run this request every 1 min
//window.setInterval(updateNotificationBox, 10000);