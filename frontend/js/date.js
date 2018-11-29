function datetext() {
    var date = new Date();
    document.getElementById("date_text").innerHTML = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}
