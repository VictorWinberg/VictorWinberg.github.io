window.onload = function () {
    var year = document.getElementById("year");
    if (year) {
        year.innerHTML = new Date().getFullYear();
    }
}