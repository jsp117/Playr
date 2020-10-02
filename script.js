var sl1 = [];
var sn1 = [];
var songLinks = [];
var songNames = [];
var remove4 = [];
var sc1 = [];
var sc = [];
var sc1Names = [];
var scNames = [];
var alter = [];
var newArray = [];
var finalArray = [];
var bandNames = [];
var songNames = [];
var youtubeLinks = [];
var song;
var artist;
var count = 0;

// https://openwhyd.org/u/4d94501d1f78ac091dbc9b4d/playlist/10?format=links&limit=10000 - working to post 10000 links from adrians profile
function music(x) {
  $.ajax({

    url: "https://cors-anywhere.herokuapp.com/https://openwhyd.org/hot/" + x + "?format=json&limit=1000",
    method: "GET",
    error: function (e) {
      alert("connection issues");
    }

  }).then(function (response) {
    console.log(response);
    for (var i = 0; i < response.tracks.length; i++) {
      sl1.push(response.tracks[i].eId);
      sn1.push(response.tracks[i].name);
    }
    // splits soundcloud and youtube links/artists
    for (var i = 0; i < sl1.length; i++) {
      var verify = sl1[i];
      // checks for soundcloud links - moves them to new array
      if (verify.substring(0, 4) === "/sc/") {
        // use splice to remove soundcloud link at index i, 1 item 
        var move = sl1.splice(i, 1);
        var moveNames = sn1.splice(i, 1);
        sc1.push(move);
        sc1Names.push(moveNames);
        // console.log(sc);
        count++;
      }
    }

    // songlinks, songNames = youtube songs/names
    // randomize youtube songs/names
    for (var i = 0; i < sl1.length; i++) {
      var x = Math.floor(Math.random() * sl1.length);
      var y = sl1[i];
      sl1[i] = sl1[x];
      sl1[x] = y;
      var a = sn1[i];
      sn1[i] = sn1[x];
      sn1[x] = a;
    }

    for (var i = 0; i < 15; i++) {
      songLinks.push(sl1[i]);
      songNames.push(sn1[i]);
    }

    // randomize soundcloud songs/names
    for (var i = 0; i < sc1.length; i++) {
      var x = Math.floor(Math.random() * sc1.length);
      var y = sc1[i];
      sc1[i] = sc1[x];
      sc1[x] = y;
      var a = sc1Names[i];
      sc1Names[i] = sc1Names[x];
      sc1Names[x] = a;
    }
    if (sc1.length < 15) {
      for (var i = 0; i < sc1.length; i++) {
        sc.push(sc1[i]);
        scNames.push(sc1Names[i]);
      }
    } else {
      for (var i = 0; i < 15; i++) {
        sc.push(sc1[i]);
        scNames.push(sc1Names[i]);
      }
    }

    // if there are youtube songs
    if (songLinks.length > 0) {
      $("#youtube").attr("style", "display: inline-block;");
      youtube();
    } else {
      $("#youtube").attr("style", "display: none;");
      $("#lyrics").attr("style", "display: none;");
    }
    // else - hide youtube card


    // if there are soundcloud songs
    if (sc.length > 0) {
      $("#music").attr("style", "display: inline-block;");
      $("#player").attr("style", "display: inline-block;");
      soundcloud();
    } else {
      $("#music").attr("style", "display: none;");
      $("#player").attr("style", "display: none;");
      $("#lyrics").attr("style", "display: none;");

      // hide soundcloud card
    }

  });
}

// checks if the song has available lyrics and for song id on musixmatch
function lyricsFinder(x, y) {
  if (x === undefined || y === undefined) {
    $("#lyrics").attr("style", "display: none;");
    return console.log("song and or artist undefined");

  }
  // console.log("song name, artist name: " + x + y);
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

    if (response.message.header.available === 0) {
      $("#lyrics").attr("style", "display: none");
      return;
    } else {
      var hasLyrics = response.message.body.track_list[0].track.has_lyrics;
      var trackId = response.message.body.track_list[0].track.track_id;
      if (hasLyrics === 1) {
        $("#lyrics").attr("style", "display: inline-block");
        lyrics(trackId);
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

  youtubeLinks = [];

  // $("#youtube").attr("src", "http://www.youtube.com/watch?v=" + remove4[0]);

  for (var i = 0; i < songLinks.length; i++) {
    youtubeLinks.push("http://www.youtube.com/watch?v=" + remove4[i]);
  }
  for (var i = 0; i < youtubeLinks.length; i++) {
      // var li = $("<div>");
    // var br = $("<br>");
    var aTag = $("<a>");
    var div = $("<div>").attr("id", i + "div");
    // li.attr("id", i);
    aTag.text((i + 1) + ": " + songNames[i]);
    $("#youtube").append(aTag);
    $("#youtube").append(div);
    // wraps div tag with 'a' tag
    $("#"+ i + "div").wrap("<a class = 'new'></a>");
    aTag.attr("href", youtubeLinks[i]).attr("target", "_blank");
    // $("#youtube").append(br);
  }
  // push stills of youtube videos to div on page - with working link to youtube
}

function soundcloud() {
  // returns second piece of split string
  // console.log("soundcloud links: " + sc);
  console.log(sc);
  newArray = sc.map(function (i) {
    return i[0].split("https").pop();
  });
  // console.log("after first split: " + newArray);
  // takes "stream" off end of each string in array

  // removes stream but adds comma
  // for (var i = 0; i < newArray.length; i++) {
  //   finalArray.push(newArray[i].split("/stream"));
  // }
  // for (var i = 0; i < finalArray.length; i++) {
  //   testArray.push(finalArray[i].split(","));
  // }

  // working to remove stream where it exists
  for (var i = 0; i < newArray.length; i++) {
    if (newArray[i].includes("/stream")) {
      finalArray[i] = newArray[i].slice(0, -7);
    } else {
      finalArray.push(newArray[i]);
    }
  }

  // removes 7 characters regardless of stream existing at the end
  // finalArray = newArray.map(function (n){
  //   return n[0].split("/stream");
  // });
  console.log("after split" + finalArray);
  // finalArray = newArray.map(x => x.slice(0, -7));
  // adds working soundcloud link to soundcloud player
  $("#music").attr("src", "https://w.soundcloud.com/player/?url=https" + finalArray[0]);

  // grab soundcloud artist name
  bandNames = scNames.map(function (n) {
    return n[0].split(" - ");
  });
  // grabs song names 
  songNames = scNames.map(function (n) {
    return n[0].split(" - ").pop();
  });
  console.log("bandNames = " + bandNames);
  console.log("songNames = " + songNames);

  // display soundcloud song names on id player
  for (var i = 0; i < scNames.length; i++) {
    var li = $("<p>");
    li.attr("id", i);
    li.text((i + 1) + ": " + scNames[i]);
    $("#player").append(li);
  }
  // not working properly
  if (songNames[0].includes("(")) {
    song = songNames[0].split("(");
  }
  if (songNames[0].includes(",")) {
    song = songNames[0].split(",");
  }


  lyricsFinder(song, artist);
  // soundcloud working embedded player link
  // https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/148670062
}

// plays song on click
$("#player").on("click", "p", function () {
  var scLink = this.id;
  $("#music").attr("src", "https://w.soundcloud.com/player/?url=https" + finalArray[scLink]);



  console.log("BEFORE songname: " + songNames[scLink] + " artist: " + bandNames[scLink]);


  // not working properly
  if (songNames[scLink].includes("(")) {
    song = songNames[scLink].split("(");
    song = song.toString();
  }
  if (songNames[scLink].includes(",")) {
    song = songNames[scLink].split(",");
    song = song.toString();
  }
  console.log("AFTER songname: " + song + " artist: " + artist);
  lyricsFinder(song, artist);

});

$("#top").on("click", function () {
  $('html, body').animate({
    scrollTop: '0px'
  }, 2000);

});

$("#musicInput").on("keydown", function (event) {
  // reset all arrays
  $("body").attr("style", "overflow: visible;");
  $("#lyrics").empty();
  $("#player").empty();
  $("#youtube").empty();
  alter.length = 0;
  bandNames.length = 0;
  sc1.length = 0;
  sc1Names.length = 0;
  sl1.length = 0;
  sn1.length = 0;
  youtubeLinks.length = 0;
  scNames.length = 0;
  sc.length = 0;
  newArray.length = 0;
  finalArray.length = 0;
  remove4.length = 0;
  songLinks.length = 0;
  songNames.length = 0;

  if (event.keyCode == 13) {
    var genre = $("#musicInput").val();
    // auto scroll to main content on enter
    $([document.documentElement, document.body]).animate({
      scrollTop: $("#stop").offset().top
    }, 2000);
    console.log(genre);
    music(genre);
    youtubePlay(genre);
  }
});


function youtubePlay(y) {
  var frameId = $("#youtubePly");
  if (y.toLowerCase() === "rock") {
      frameId.attr("src", "https://www.youtube.com/embed/PsR_C4GTgFg");
  } else if (y.toLowerCase() === "indie") {
      frameId.attr("src", "https://www.youtube.com/embed/_3Jy1wc8pOg");
  } else if (y.toLowerCase() === "study") {
      frameId.attr("src", "https://www.youtube.com/embed/f02mOEt11OQ")
  } else if (y.toLowerCase() === "pop") {
      frameId.attr("src", "https://www.youtube.com/embed/Owg9esIqG_Y")
  } else if (y.toLowerCase() === "blues") {
      frameId.attr("src", "https://www.youtube.com/embed/qD9bZ7AQwPI")
  } else if (y.toLowerCase() === "punk") {
      frameId.attr("src", "https://www.youtube.com/embed/n5iuZkETnsE")
  } else if (y.toLowerCase() === "metal") {
      frameId.attr("src", "https://www.youtube.com/embed/j6niFit62ss")
  } else if (y.toLowerCase() === "r&b") {
      frameId.attr("src", "https://www.youtube.com/embed/4q2RH5-HBRE")
  } else if (y.toLowerCase() === "soul") {
      frameId.attr("src", "https://www.youtube.com/embed/pN4ocNJSP6s")
  } else if (y.toLowerCase() === "jazz") {
      frameId.attr("src", "https://www.youtube.com/embed/Oxt4Ut_Q55I")
  } else if (y.toLowerCase() === "classical") {
      frameId.attr("src", "https://www.youtube.com/embed/tPO9jxUKIsc")
  } else if (y.toLowerCase() === "reggae") {
      frameId.attr("src", "https://www.youtube.com/embed/JPctC3HNLwM")
  } else if (y.toLowerCase() === "latin") {
      frameId.attr("src", "https://www.youtube.com/embed/XaWLdx_ake8")
  } else if (y.toLowerCase() === "world") {
      frameId.attr("src", "https://www.youtube.com/embed/NgN12_xNHb0")
  } else if (y.toLowerCase() === "hip hop") {
      frameId.attr("src", "https://www.youtube.com/embed/5qap5aO4i9A")
  } else if (y.toLowerCase() === "electronic") {
      frameId.attr("src", "https://www.youtube.com/embed/zdYzL6wkr0A")
  } else {
      alert("we dont have that shhhiii");
  }

}

$("#upButton").on("click", function() {
  $(function() {
      $("#upButton").on('click', function() {
          $("HTML, BODY").animate({
              scrollTop: 0
          }, 1000);
      });
  });
})


// youtube playlist for genre
// function youtubePlaylist(){
// $("#youtubePlayer").attr("src", "https://www.youtube.com/embed/_3Jy1wc8pOg");

//   // https://www.youtube.com/embed/_3Jy1wc8pOg

// }

// youtubePlaylist();



