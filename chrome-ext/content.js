window.addEventListener ("load", factCheck, false);

function factCheck (evt) {
    var url = window.location.href;

    $.ajax({
	    type: "POST",
	    url: "http://opendatakosovo.org/app/istinomer-factcheckr/api/factcheck/get",
	    //url: "http://localhost:5000/api/factcheck/get",
	    data: JSON.stringify({url: url}),
	    contentType: "application/json"
	  }).done(function(data) {
	    
		var nodes = document.getElementsByTagName('p');
		for(j = 0; j < nodes.length; j++){
			for (i = 0; i < data.length; i++) { 
				if(nodes[j].innerHTML.indexOf(data[i].text) != -1){
					nodes[j].setAttribute("style", "background-color:red;");
					console.log(nodes[j]);
				}
				
			}
		}
			
	  }).fail(function() {
		alert('An unexpected error has occured.');
	  });
}