$(document).ready(function() {
    navigator.vibrate = 
    navigator.vibrate 
    || navigator.webkitVibrate 
    || navigator.mozVibrate 
    || navigator.msVibrate;
    // Support for different browsers.
    $("#sbm").click(function() {
        navigator.vibrate([400, 200, 400]); //Vibrate for 200ms, pause for 200ms, vibrate again for 200ms.
    });
    $("a").click(function(){
    	navigator.vibrate(200);
    })
    $(".inputLabel").click(function(){
    	navigator.vibrate(200);
    })
});

navigator.getBattery().then(function(battery) {
  function updateAllBatteryInfo(){
    updateLevelInfo();
  }
  updateAllBatteryInfo();

 
  battery.addEventListener('levelchange', function(){
    updateLevelInfo();
  });
  function updateLevelInfo(){
    if(battery.level < 0.10){
    	alert("Battery level is " + (battery.level * 100) + ", close this page to save battery!");
    }
  }

});