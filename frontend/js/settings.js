// if(localStorage.getItem('')
// var pull = function(settings){
// 	localStorage.getItem('productive');
// 	localStorage.getItem('non-productive');
// }



var data = JSON.parse(localStorage.getItem('key'));

var unset = [];
var size;
// localStorage.setItem('productive',"");
// localStorage.setItem('non-productive',"");
$("#theverge.com").prop("checked", true);
function clean(rawData) {
        console.log("settings test2");
        var p = localStorage.getItem('productive');
        var np = localStorage.getItem('non-productive');
        for (var name in data) {
            var value = data[name];
            // console.log("if");
            if (!unset.includes(value.name)) {
                // console.log("appended");
                unset.push(value.name);
            }
        }
        localStorage.setItem('unset', unset);
        size = unset.length;
        for (var i = 0; i < size; i++) {
            // $("#form").html('<p>hello</p>');
            // $('#form').css( "background-color","black" );
            console.log(unset[i]);
            $('#form').append('<label class="inputLabel">'+unset[i]+'<input type="checkbox" id="'+unset[i]+'"><span class="checkmark"></span></label>');
        }
        if (localStorage.getItem('productive') == null && localStorage.getItem('non-productive') == null) {
            // console.log("empty");
            p = [];
            np = [];
        }
        else {
            p = p.split(",");
            np = np.split(",");
            console.log(p);
            console.log(np);

            for (var i = 0; i < p.length; i++){
                console.log(p[i]);
                document.getElementById(p[i]).checked = true;
            } 
        if (localStorage.getItem('calKey') == null) {
            // alert("You haven't set up your Calender API yet!");
            // window.location.href = "signup.html";
        }
        if (localStorage.getItem('rtKey') == null) {
            // alert("You haven't set up your RescueTime API yet!");
            // window.location.href = "signup.html";
        }

    }
}



function display() {
	size = unset.length;
	for (var i = 0; i < size; i++) {
		// $("#form").html('<p>hello</p>');
		// $('#form').css( "background-color","black" );
		console.log(unset[i]);
		$('#form').prepend('<label class="inputLabel">'+unset[i]+'<input type="checkbox" id="'+unset[i]+'"><span class="checkmark"></span></label>');
	}
}


function submit() {
	alert("Settings Submitted!");
	// var p = localStorage.getItem('productive');
 //    var np = localStorage.getItem('non-productive');
    var p = [];
    var np = [];
	for (var i = 0; i < unset.length; i++) {
		// alert(unset[i]+" was set to true");
		// alert($('#google.com').is(":checked"));
		if (document.getElementById(unset[i]).checked) {
            	p.push(unset[i]);
            	localStorage.setItem('productive',p);

    	}
    	else{
            	np.push(unset[i]);
            	localStorage.setItem('non-productive',np);
    	}

	}
	localStorage.removeItem("unset");
    /**** Storing API Keys ****/
    var calKey = $.trim($("#calKey").val()); // Pulling the value of the key from the ID Tag and trimming the whitespaces.
    calKeyl = calKey.length;
    var rtKey = $.trim($("#rtKey").val()); 
    var sDate = $.trim($("#dateInput").val());
    if (calKeyl>0) { // If length of string is > 0.
        localStorage.setItem('calKey',calKey); // Stores the variable "calKey" into localStorage, the key to access this in localStorage is also called calKey.
    }
    if (rtKey.length>0) {
        localStorage.setItem('rtKey',rtKey);
    }
    if(sDate.length>0){
        localStorage.setItem('date',sDate);
    }
    
    /*
    To check what's in localStorage. 
    Right-click in chrome and go under 
    the applications tab. There's a 
    "localStorage" section where you 
    can see what is currently in local 
    storage, and clear.
    */
}


$(document).ready(function() {
	clean(data);
	// display(unset);
    // display();
});




