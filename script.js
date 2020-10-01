var songLinks = [];
var songNames = [];
var remove4 = [];
var count = 0;
var sc = [];
var scNames = [];
var alter = [];
var newArray = [];
var finalArray = [];
var bandNames = [];
var songNames = [];

// https://openwhyd.org/u/4d94501d1f78ac091dbc9b4d/playlist/10?format=links&limit=10000 - working to post 10000 links from adrians profile
function music(x) {
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
    for (var i = 0; i < songLinks.length; i++) {
      var verify = songLinks[i];
      // checks for soundcloud links - moves them to new array
      if (verify.substring(0, 4) === "/sc/") {
        // use splice to remove soundcloud link at index i, 1 item 
        var move = songLinks.splice(i, 1);
        var moveNames = songNames.splice(i, 1);
        sc.push(move);
        scNames.push(moveNames);
        // console.log(sc);
        count++;
      }
    }
    // console.log("soundcloud links: " + sc);
    // console.log("Youtube Links 1: " + songLinks);
    // console.log("count = " + count)
    // if there are youtube songs
    if (songLinks.length > 0) {
      youtube();
    }
    // if there are soundcloud songs
    if (sc.length > 0) {
      $("#music").attr("style", "display: inline-block;");
      soundcloud();
    } else {
      $("#music").attr("style", "display: none;");
    }

  });
}

// checks if the song has available lyrics and for song id on musixmatch
function lyricsFinder(x, y) {
  console.log("song name, artist name: " + x + y)
  // console.log("soundcloud name");
  // console.log(scNames[0]);
  $.ajax({

    url: "https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.search?q+track=" + x + "&q_artist=" + y + "&page_size=3&page=1&apikey=8bbc0afcba88ea6ff307c8f74137d9e3",
    method: "GET",
    dataType: "json",

    error: function (e) {
      alert("connection issues");

    }
  }).then(function (response) {
    console.log(response);
    // console.log("Musixmatch response: ");
    // console.log(response);
    // console.log(response.message.body.track_list[0].track.track_id);
    // console.log(response.message.body.track_list[0].track.has_lyrics);
    if (response.message.header.available === 0) {
      $("#lyrics").text("No Lyrics Available");

    } else {

      var hasLyrics = response.message.body.track_list[0].track.has_lyrics;
      var trackId = response.message.body.track_list[0].track.track_id;
      if (hasLyrics === 1) {
        lyrics(trackId);
      } else {
        $("#lyrics").text("No Lyrics Available");
      }

    }
  });
}

// grabs song lyrics
function lyrics(x) {

  $.ajax({

    url: "https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=" + x + "&apikey=8bbc0afcba88ea6ff307c8f74137d9e3",
    method: "GET",
    dataType: "json",

    error: function (e) {
      alert("connection issues");

    }
  }).then(function (response) {
    // console.log("Musixmatch response: ");
    // console.log(response.message.body.lyrics.lyrics_body);
    var lyrics = response.message.body.lyrics.lyrics_body;
    $("#lyrics").text(lyrics);
  });

}

function youtube() {
  // for each item in songLinks - take 4 characters from the front of each item - provides youtube links
  remove4 = songLinks.map(s => s.slice(4));

  var youtubeLinks = [];

  // $("#youtube").attr("src", "http://www.youtube.com/watch?v=" + remove4[0]);

  for (var i = 0; i < 16; i++) {
    youtubeLinks.push("http://www.youtube.com/watch?v=" + remove4[i]);
  }
  // console.log(youtubeLinks);
  // push stills of youtube videos to div on page - with working link to youtube
  $("#youtube").text(youtubeLinks);
  // $("#player").text(sc);
}

function soundcloud() {
  // trying to split everything before https from sc strings in array
  // console.log("Soundcloud before: " + sc);
  $("#player").text(sc);
  // returns second piece of split string
  newArray = sc.map(function (i) {
    return i[0].split("https").pop();
  });
  // takes "stream" off end of each string in array
  finalArray = newArray.map(x => x.slice(0, -7));
  // console.log("NEW = " + newArray);
  // console.log("final = " + finalArray);
  // adds working soundcloud link to soundcloud player
  $("#music").attr("src", "https://w.soundcloud.com/player/?url=https" + finalArray[0]);
  // console.log("https://w.soundcloud.com/player/?url=https" + finalArray[0]);
  // console.log("altered sc links: " + sc);
  // grab soundcloud song names and artist name
  console.log("SC NAMES: " + scNames);
  bandNames = scNames.map(function (n) {
    return n[0].split(" - ");

  });
  songNames = scNames.map(function (n) {
    return n[0].split(" - ").pop();
  });
  console.log("bandNames = " + bandNames);
  console.log("songNames = " + songNames);





  lyricsFinder(songNames[0], bandNames[0]);
  // soundcloud working embedded player link
  // https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/148670062
}

$("#musicInput").on("keydown", function (event) {
  // reset all arrays
  sc.length = 0;
  newArray.length = 0;
  finalArray.length = 0;
  remove4.length = 0;
  songLinks.length = 0;
  songNames.length = 0;

  if (event.keyCode == 13) {
    var genre = $("#musicInput").val();
    console.log(genre);
    music(genre);
  }
});


// youtube playlist for genre
// function youtubePlaylist(){
// $("#youtubePlayer").attr("src", "https://www.youtube.com/embed/_3Jy1wc8pOg");

//   // https://www.youtube.com/embed/_3Jy1wc8pOg

// }

// youtubePlaylist();



