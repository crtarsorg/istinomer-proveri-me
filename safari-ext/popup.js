var API_URL_FETCH = "http://0.0.0.0:3000/api/entry/get";



var notify = function (msg) {
    // Check for notification compatibility.
    if (!'Notification' in window) {
        // If the browser version is unsupported, remain silent.
        return;
    }
    // If the user has not been asked to grant or deny notifications
    // from this domain...
    if (Notification.permission === 'default') {
        Notification.requestPermission(function () {
            // ...callback this function once a permission level has been set.
            notify(msg);
        });
    }
    // If the user has granted permission for this domain to send notifications...
    else if (Notification.permission === 'granted') {
        var n = new Notification(
                    'New message from Fact Checker',
                    {
                      'body': msg,
                      // ...prevent duplicate notifications
                      'tag' : 'unique string'
                    }
                );
        // Remove the notification from Notification Center when clicked.
        n.onclick = function () {
            this.close();
        };
        // Callback function when the notification is closed.
        n.onclose = function () {
            console.log('Notification closed');
        };
    }
    // If the user does not want notifications to come from this domain...
    else if (Notification.permission === 'denied') {
        // ...remain silent.
        return;
    }
};

var user_factcheck_requests = JSON.parse(localStorage.getItem('userData'));
    if (user_factcheck_requests && user_factcheck_requests.length > 0){
    // Call the function to build HTML DOM on data fetch from LS
        buildHTML(user_factcheck_requests);
        $.each(user_factcheck_requests,function(key, item){
            user_factcheck_requests[key]['new_update'] = false
        });
        localStorage.setItem('userData', JSON.stringify(user_factcheck_requests));
    } else {
        $('.list-group-factcheckr').append(
            "<li >" +
                "<p class='itemText'>"+ "Nijedan rezultat nije prona"+"&#273;"+"en." + "</p>" +
            "</li>"
        );

    }

function updateNotificationBox(){

    // Get user Id from local storage if it exists, otherwise generate one
    var userId = localStorage.getItem('userId');
    if (userId) {
      // Execute request to API server
      retrieveDataWithUserToken(userId);
    }
    else {
        userId = Math.random().toString(36);
        localStorage.setItem('userId', userId);
      retrieveDataWithUserToken(userId);


    }
}

function retrieveDataWithUserToken(user_id){

    $.ajax({
        type: "POST",
        url: API_URL_FETCH,
        data: JSON.stringify({chrome_user_id: user_id}),
        contentType: "application/json"
      }).done(function (respData) {


            var localUserData = localStorage.getItem('userData');
            var total_cnt = 0;
            if(localUserData){
                localUserData = JSON.parse(localStorage.getItem('userData'));
            }

            $.each(respData, function(key, apiJson){
                var counter = checkDataVerificationOnResponse(localUserData, apiJson);

                total_cnt = total_cnt + counter;
            });

            if(total_cnt > 0){
                notify('New facts!')
            }

            localStorage.setItem('userData', JSON.stringify(respData));

      }).fail(function (err) {
        // console.log(JSON.stringify(err));
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
        'Not started': 'Ni zapo&#269;eto', //Ni započeto
        'Consistent': 'Dosledno',
        'Inconsistent': 'Ne&#353;to izme&#273;u', //Nešto između
        'In between': 'Nedosledno'
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
                            "<a class='spanLink' style='padding: 5px' href='"+ item['url'] + "'>" + domain + "</a>" +
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


window.setInterval(updateNotificationBox, 10000);

safari.application.addEventListener("popover", function() {
    buildHTML(JSON.parse(localStorage.getItem('userData')));

    location.reload();
}, true);


