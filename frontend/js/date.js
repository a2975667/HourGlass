function datetext() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    document.getElementById("date_text").innerHTML = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}
