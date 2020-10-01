// import Plyr from 'plyr';
// const player = new Plyr('#player');

var songLinks = [];
var songNames = [];
var remove4 =[];
var count = 0;
var sc = [];
var scArtists = [];
var alter = [];


  // https://openwhyd.org/u/4d94501d1f78ac091dbc9b4d/playlist/10?format=links&limit=10000 - working to post 10000 links from adrians profile
function music(x){
  $.ajax({

    url: "https://cors-anywhere.herokuapp.com/https://openwhyd.org/hot/" + x + "?format=json&limit=100",
    method: "GET",
    error: function (e) {
      alert("connection issues");

    }
  }).then(function (response) {
    console.log(response);
    for (var i = 0; i < response.tracks.length; i++) {
      songLinks.push(response.tracks[i].eId);
      songNames.push(response.tracks[i].name);
    }
    // splits soundcloud and youtube links/artists
    for(var i = 0; i<songLinks.length; i++){
      var verify = songLinks[i];
      if (verify.substring(0, 4) === "/sc/"){
        // use splice to remove soundcloud link at index i, 1 item 
        var move = songLinks.splice(i, 1);
        var moveArtists = songNames.splice(i, 1);
        sc.push(move);
        scArtists.push(moveArtists);
        // console.log(sc);
        count++;
      }
    }
    console.log("soundcloud links: " + sc);
    console.log("Youtube Links 1: " + songLinks);
    console.log("count = " + count)

    youtube();
    soundcloud();
    

    // if (count < 16){
      
    // }else{
      
    // }

    // if there are 20 soundcloud links - pull soundcloud links out and add to embedded player


    // console.log(songLinks);
    // console.log(songNames);
    
  });
}

function youtube() {

  // for each item in songLinks - take 4 characters from the front of each item - provides youtube links
remove4 = songLinks.map(s => s.slice(4));

var youtubeLinks = [];

// $("#youtube").attr("src", "http://www.youtube.com/watch?v=" + remove4[0]);

for(var i = 0; i<16; i++){
  youtubeLinks.push("http://www.youtube.com/watch?v=" + remove4[i]);
}
console.log(youtubeLinks);
// push stills of youtube videos to div on page - with working link to youtube
$("#youtube").text(youtubeLinks);
// $("#player").text(sc);
}

function soundcloud(){
// trying to split everything before https from sc strings in array
console.log("Soundcloud before: " + sc);
$("#player").text(sc);
scString = sc.toString();
alter = scString.map(a => a.split("https"));
console.log("altered sc links: " + alter);
// soundcloud embedded player link
// https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/148670062
}

$("#musicInput").on("keydown", function (event) {
  songLinks.length = 0;
  songNames.length = 0;

  if (event.keyCode == 13) {
    var genre = $("#musicInput").val();
    console.log(genre);
    music(genre);
  }
});









