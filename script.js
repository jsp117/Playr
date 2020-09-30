// import Plyr from 'plyr';
// const player = new Plyr('#player');

var songLinks = [];
var songNames = [];
function music(x) {


  // https://openwhyd.org/u/4d94501d1f78ac091dbc9b4d/playlist/10?format=links&limit=10000 - working to post 10000 links from adrians profile

  $.ajax({

    url: "https://cors-anywhere.herokuapp.com/https://openwhyd.org/hot/" + x + "?format=json",
    method: "GET",
    error: function (e) {
      alert("connection issues");

    }
  }).then(function (response) {

    for (var i = 0; i < response.tracks.length; i++) {
      songLinks.push(response.tracks[i].eId);
      songNames.push(response.tracks[i].name);
    }
    console.log(songLinks);
    console.log(songNames);
    play();
  });
}

function play() {
  
var remove4 = songLinks.map(s => s.slice(4));
var songs = remove4.toString();
console.log("songs: " + songs);
$("#youtube").attr("src", "https://www.youtube.com/embed/" + remove4[1]);


}

$("#musicInput").on("keydown", function (event) {
  if (event.keyCode == 13) {
    var genre = $("#musicInput").val();
    console.log(genre);
    music(genre);
  }
});









