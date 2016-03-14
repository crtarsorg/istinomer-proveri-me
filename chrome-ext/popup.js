/** Popup content provider logic. **/

var API_URL_FETCH = "http://opendatakosovo.org/app/istinomer-factcheckr/api/entry/get";

document.addEventListener("DOMContentLoaded", function () {

    // Retrieve data from local storage, otherwise retrieve them from database
    chrome.storage.local.get('user_data', function(items){

        var user_factcheck_requests = items.user_data;
        if (user_factcheck_requests){
            // Call the function to build HTML DOM on data fetch from LS
            if(user_factcheck_requests.length > 0){
                buildHTML(user_factcheck_requests);
                $.each(user_factcheck_requests,function(key, item){
                    user_factcheck_requests[key]['new_update'] = false
                });
                chrome.storage.local.set({user_data: user_factcheck_requests});
            }
            else {
                $('.list-group-factcheckr').append(
                    "<li >" +
                        "<p class='itemText'>"+ "Nijedan rezultat nije prona"+"&#273;"+"en." + "</p>" +
                    "</li>"
                );

            }
            // Add the badge to the extension icon
            chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
            chrome.browserAction.setBadgeText({text: ''});
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
        url: API_URL_FETCH,
        data: JSON.stringify({chrome_user_id: user_id}),
        contentType: "application/json"
      }).done(function (respData) {

        chrome.storage.local.get('user_data', function(localData){

            var localUserData = localData.user_data;

            var total_cnt = 0;
            if(localUserData){

                $.each(respData, function(key, apiJson){
                    var counter = checkDataVerificationOnResponse(localUserData, apiJson);

                    total_cnt = total_cnt + counter;
                });

                if(total_cnt > 0){
                    var ntf_txt;
                    chrome.browserAction.getBadgeText({}, function(previous_ntf_nr) {

                        if(previous_ntf_nr == ''){
                            previous_ntf_nr = 0;
                        }
                        else {
                            previous_ntf_nr = parseInt(previous_ntf_nr);
                        }

                        var ntf_nr = total_cnt + previous_ntf_nr;
                        if (ntf_nr > 0){
                            ntf_txt = ntf_nr.toString();
                        }
                        else {
                            ntf_txt = '';
                        }
                         // Add the badge to the extension icon
                        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
                        chrome.browserAction.setBadgeText({text: ntf_txt});
                    });

                }
                // Save the response data to a local storage,
                // so that we dont need to interact with API server every time
                chrome.storage.local.set({user_data: respData});
            }

        });

      }).fail(function (err) {
        // console.log(JSON.stringify(err));
      });
}

function buildHTML(respData){

    // Empty current items from the
    $('.list-group-factcheckr').empty();

    var grades_json = {
        'True': 'Istina',
        'Mostly true': 'Skoro istina',
        'Half true': 'Poluistina',
        'Mostly false': 'Skoro neistina',
        'False': 'Neistina',
        'Pants on fire': 'Kratke noge',
        'Fulfilled': 'Ispunjeno',
        'Almost fulfilled': 'Skoro ispunjeno',
        'In progress': 'Radi se na tome',
        'Stalled': 'Krenuli pa stali',
        'Unfulfilled': 'Neispunjeno',
        'Not started': 'Ni započeto',
        'Consistent': 'Dosledno',
        'In between': 'Nedosledno',
        'Inconsistent': 'Nešto između'
    };

    $.each(respData, function(index, item){
        var grade;
        if(item['grade']){
            grade = grades_json[item['grade']];
        }
        else{
            grade = "";
        }

        if(item['domain']){
            var domain = item['domain'];
        }
        else {
            domain = '';
        }

        if (item['_id']){
            var list_tag = "<li id='" + item['_id']['$oid'] + "'>";
        }
        else {
            list_tag = "<li>";
        }

        if(item['inappropriate'] || item['inappropriate'] == ""){

            if (!(item['inappropriate'] == "")){
                var inapproper_html = "<div>"+
                                        "<b>Razlog: </b>" + "<i>" + item['inappropriate'] + "</i>" +
                                    "</div><br>";
            }
            else{
                inapproper_html = '';
            }

            // if the content were flagged as inappropriate inject this html element to DOM
            $('.list-group-factcheckr').append(
                list_tag +
                    "<div class='popUpStories'>" +
                        "<p class='itemTxt'>"+ item['text'] + "</p>" +
                        "<div style='display: inline-block;float: right;margin-right:7px;'>"+
                            "<span class='evalMark' style='padding: 5px; margin:3px'><strong>" + "Neprikladno" +"</strong></span>" +
                            "<a class='spanLink' style='padding: 5px' href='"+  item['url']  + "' target='_blank'>" + domain + "</a>" +
                        "</div>" +
                    "</div><br>" +
                    inapproper_html +
                "</li>"
            );
        }
        else{
            $('.list-group-factcheckr').append(
                list_tag +
                    "<div class='popUpStories'>" +
                        "<p class='itemTxt'>"+ item['text'] + "</p>" +
                        "<div style='display: inline-block;float: right;margin-right:7px;'>"+
                            "<span class='spanGrade' style='padding: 5px; margin:3px'><strong>" + grade + "</strong></span>" +
                            "<a class='spanLink' style='padding: 5px' href='"+ item['url'] + "' target='_blank'>" + domain + "</a>" +
                        "</div>" +
                    "</div><br>" +
                "</li>"
            );
        }

        if (item['new_update'] == true){
            $('#' + item['_id']['$oid']).css({'border-color': '#512e3c', 'background': '#7d9bb8'});
        }

    });

}

function checkDataVerificationOnResponse(localData, respJson){

    var ntf_count = 0;
    // create notification based on the response we got
    $.each(localData, function(key, item){

        if(item['_id']){
            if (respJson['_id']['$oid'] == item['_id']['$oid']){

                if(respJson['classification'] != item['classification']){
                    ntf_count++;
                }
                else if(respJson['grade'] != item['grade']){
                    ntf_count++;
                }
                else if (respJson['inappropriate'] || respJson['inappropriate'] == ""){
                    if (respJson['inappropriate'] != item['inappropriate']){
                        ntf_count++;
                    }
                }
                if (ntf_count == 0 && item['new_update'] != true){
                    respJson['new_update'] = false;
                }
            }
        }
    });

    return ntf_count;
}
// Run this request
window.setInterval(updateNotificationBox, 10000);