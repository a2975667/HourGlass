$(document).ready(function() {
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

    $("h2").click(function(){
    	alert("test");
    	navigator.vibrate(1000);
    })
    $(".checkmark").click(function() {
        console.log("vibrating");
        navigator.vibrate(1000);
    });
    $("#sbm").click(function() {
        navigator.vibrate([200, 200, 200]); //Vibrate for 200ms, pause for 200ms, vibrate again for 200ms.
        alert("vibrating");
    });

});