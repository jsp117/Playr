
// spotify id/secret
// var id = "337eb2b35e9b450d86ae8a81ad1498d1";
// var secret = "e0835d8093b649e690ab60ee1beca993";

// function openPage(){


// var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: {
//       'Authorization': 'Basic ' + (new Buffer(id + ':' + secret).toString('base64'))
//     },
//     form: {
//       grant_type: 'client_credentials'
//     },
//     json: true
//   };
//   console.log(complete);
//   music()
// }


function music() {

 
    $.ajax({

        url: "https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/artists/1vCWHaC5f2uS3yhpwWbIA6/albums?album_type=SINGLE&offset=20&limit=10",
        method: "GET",
        dataType: "json",
        headers: {
            'Authorization': 'Bearer ' + id
        },
        error: function (e) {
            alert("connection issues");
            
        }
    }).then(function (response) {
        console.log(response);



    });
}

music();

