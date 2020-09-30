function openWhyd() {
    $.ajax({
        url: "https://openwhyd.org/hot/rock",
        method: "GET",
        dataType: "json",
        error: function(e) {
            alert("connection issues");
            return;
        }
    }).then(function(response) {
        console.log(response);



    });
}