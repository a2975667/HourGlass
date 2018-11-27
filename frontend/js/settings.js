

// if(localStorage.getItem('')
// var pull = function(settings){
// 	localStorage.getItem('productive');
// 	localStorage.getItem('non-productive');
// }


// document.getElementById("clickMe").onclick = function () { alert('hello!'); };

// $("form").append('<p>hello</p>');

var data = JSON.parse(localStorage.getItem('key'));

var unset = [];
var size;
// localStorage.setItem('productive',"");
// localStorage.setItem('non-productive',"");

function clean(rawData) {
    console.log("settings test2");
    var p = localStorage.getItem('productive');
    var np = localStorage.getItem('non-productive');
            for (var name in data) {
            var value = data[name];
            console.log("if");
            if (!unset.includes(value.name)) {
                console.log("appended");
                unset.push(value.name);
            }
        }
        localStorage.setItem('unset', unset);
    if (localStorage.getItem('productive') == null && localStorage.getItem('non-productive') == null) {
        console.log("empty");
        p = [];
        np = [];

    }

    else {
    	localStorage.removeItem('productive');
    	localStorage.removeItem('non-productive');
    	// localStorage.removeItem('unset');
    	
    // 	alert("More shit happening");
    // 	var p = p.split();
    // 	var np = np.split();
    // 	for (var i = 0; i < unset.length; i++) {
	 		// if(p.includes(unset[i])){
	 		// 	localStorage.removeItem(unset[i]);
	 		// }
    // 	}
    	// // var np = JSON.parse(np);
     //    for (var name in data) {
     //        var value = data[name];
     //        if (!p.includes(value.name)) {
     //            // console.log("appended");
     //            unset.push(value.name);
     //        }
     //    }
     //    for (var name in data) {
     //        var value = data[name];
     //        if (!p.includes(value.name)) {
     //            // console.log("appended");
     //            unset.push(value.name);
     //        }
     //    }
    }
}



function display() {
	size = unset.length;
	for (var i = 0; i < size; i++) {
		// $("#form").html('<p>hello</p>');
		// $('#form').css( "background-color","black" );
		console.log(unset[i]);
		$('.form').prepend('<label class="inputLabel">'+unset[i]+'<input type="checkbox" id="'+unset[i]+'"><span class="checkmark"></span></label>');
	}
}


function submit() {
	alert("Settings Submitted!");
	var p = localStorage.getItem('productive');
    var np = localStorage.getItem('non-productive');
	for (var i = 0; i < unset.length; i++) {
		// alert(unset[i]+" was set to true");
		// alert($('#google.com').is(":checked"));
		if (document.getElementById(unset[i]).checked) {
            // alert("checked");
            if(localStorage.getItem('productive') == null){
            	var p = [];
            	p.push(unset[i]);
            	localStorage.setItem('productive',p);
            }
            else {
            	var p = localStorage.getItem('productive');
            	// var p2 = JSON.parse(p);
            	// if(typeof p === "string") {
            	// 	var p2=[]
            	// }
            	var p2 = [];
            	p2.push(p);
            	p2.push(unset[i]);
            	localStorage.setItem('productive',p2);
            }
    	}
    	else{
    		// alert("unchecked");
    		if(localStorage.getItem('non-productive') == null){
            	var np = [];
            	np.push(unset[i]);
            	localStorage.setItem('non-productive',np);
            }
            else {
            	var np = localStorage.getItem('non-productive');
            	// var np2 = JSON.parse(np);
            	var np2 = [];
            	np2.push(np);
            	np2.push(unset[i]);
            	localStorage.setItem('non-productive',np2);
            }
    	}
    	// alert("next");

	}
	localStorage.removeItem("unset");
}


$(document).ready(function() {
	clean(data);
	console.log("end of clean");
	// display(unset);
    display();
});




