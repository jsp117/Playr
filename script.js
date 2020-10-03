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
// for test
var scExtra = [];
var scnExtra = [];
var finalSound;

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
    console.log("original youtube link: " + songLinks);
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
    localStorage.setItem("c", count);
      localStorage.setItem(count + " gnr", $("#musicInput").val());
      localStorage.setItem(count + " ytl", songLinks);
      localStorage.setItem(count + " ytn", songNames);
      localStorage.setItem(count + " scl", sc);
      localStorage.setItem(count + " scn", scNames);
 
    console.log("count = " + count);

    // to grab extra soundcloud songs - testing
    // for (var i = 15; i<30; i++){
    //   scExtra.push(sc1[i]);
    //   scnExtra.push(sc1Names[i]);
    // }


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
    count = count + 1;
  });
  // end music function
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
      console.log("no lyrics available");
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
  // end lyrics finder
}

// grabs song lyrics
function lyrics(x) {

  $.ajax({

    url: "https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=" + x + "&apikey=8bbc0afcba88ea6ff307c8f74137d9e3",
    method: "GET",
    dataType: "json",

    error: function (e) {
      alert("connection issues");
      $("#lyrics").attr("style", "display: none");
    }
  }).then(function (response) {
    // console.log("Musixmatch response: ");
    // console.log(response.message.body.lyrics.lyrics_body);
    var lyrics = response.message.body.lyrics.lyrics_body;
    var lyricEle = $("<p>");
    lyricEle.text(lyrics);
    lyricEle.attr("style", "margin-left: 60px; margin-top: 60px;");
    $("#lyrics").append(lyricEle);
  });
  // end lyrics
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
    $("#" + i + "div").wrap("<a class = 'new'></a>");
    aTag.attr("href", youtubeLinks[i]).attr("target", "_blank");
    // $("#youtube").append(br);
  }
  // push stills of youtube videos to div on page - with working link to youtube - todo
  // end youtube
}
// grab extra soundcloud links to switch out broken links - testing
// function extraSound(){
//   var newSound = scExtra.map(function (i) {
//     return i[0].split("https").pop();
//   });

//   // working to remove stream where it exists
//   for (var i = 0; i < newSound.length; i++) {
//     if (newSound[i].includes("/stream")) {
//       finalSound[i] = newSound[i].slice(0, -7);
//     } else {
//       finalSound.push(newSound[i]);
//     }
//   }
// }
function soundcloud() {
  // returns second piece of split string
  // console.log("soundcloud links: " + sc);
  console.log(sc);
  newArray = sc.map(function (i) {
    return i[0].split("https").pop();
  });

  // working to remove stream where it exists
  for (var i = 0; i < newArray.length; i++) {
    if (newArray[i].includes("/stream")) {
      finalArray[i] = newArray[i].slice(0, -7);
    } else {
      finalArray.push(newArray[i]);
    }
  }

  console.log("after split" + finalArray);
  // finalArray = newArray.map(x => x.slice(0, -7));
  // adds working soundcloud link to soundcloud player
  $("#music").attr("src", "https://w.soundcloud.com/player/?url=https" + finalArray[0] + "&auto_play");
  // grab soundcloud artist name
  bandNames = scNames.map(function (n) {
    if (n[0].includes(" - ")) {
      return n[0].split(" - ")[0];
    } else {
      return n;
    }
    // return n[0].split(" - ");
  });
  console.log("first split band : " + bandNames);
  // grabs song names 
  songNames = scNames.map(function (n) {
    return n[0].split(" - ").pop();
  });
  console.log("first split song : " + songNames);
  // display soundcloud song names on id player
  for (var i = 0; i < scNames.length; i++) {
    var li = $("<p>");
    li.attr("id", i);
    li.text((i + 1) + ": " + scNames[i]);
    $("#player").append(li);
  }
  // remove extra characters from song/artist names
  song = songNames[0];
  artist = bandNames[0];

  // removes excess characters from song/artist names
  if (song[0].includes("feat")) {
    song = song[0].split("feat")[0];
  }
  if (song[0].includes("(")) {
    song = song[0].split("(")[0];
  }
  if (song[0].includes(",")) {
    song = song[0].split(",")[0];
  }

  if (artist[0].includes("Ft")) {
    artist = artist[0].split("Ft")[0];
  }
  if (artist.includes("(")) {
    artist = artist[0].split("(")[0];
  }
  if (artist.includes(",")) {
    artist = artist[0].split(",")[0];
  }

  scAdd(0);
  lyricsFinder(song, artist);

  // soundcloud working embedded player link
  // https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/148670062
}

function scAdd(x) {
  var iframe = document.querySelector('#music');
  iframe.src = "https://w.soundcloud.com/player/?url=https" + finalArray[x] + "&auto_play=true)";
  var widget = SC.Widget(iframe);
  // play next song on finish
  widget.bind(SC.Widget.Events.FINISH, function (eventData) {
    iframe.src = "https://w.soundcloud.com/player/?url=https" + finalArray[x++] + "&auto_play=true)";
  });
  widget.bind(SC.Widget.Events.ERROR, function (eventData) {
    iframe.src = "https://w.soundcloud.com/player/?url=https" + finalArray[x++] + "&auto_play=true)";
    console.log(x);
  });


}




// widget.bind(SC.Widget.Events.ERROR, function (eventData) {
//   // console.log("before: " + finalArray);
//   finalArray[x] = "broken link";
//   scNames[x] = "broken link";
//   // $("#" + x).remove();
//   // alert('SONG NOT FOUND');
//   if(finalArray[x] == "broken link"){
//   iframe.src = "https://w.soundcloud.com/player/?url=https" + finalArray[x+1] + "&auto_play=true)";
//   x++;
// }
//   console.log("after: " + finalArray);
//   console.log("x: " , x);
//   if (x > 15) {
//     return;
//   }
// });

// $("#music").attr("src", "https://w.soundcloud.com/player/?url=https" + finalArray[scLink] + &auto_play=true)";
// }

// plays song on click
$("#player").on("click", "p", function () {
  $("#lyrics").attr("style", "display: none");
  $("#lyrics").empty();
  var scLink = this.id;


  // console.log("BEFORE songname: " + songNames[scLink] + " artist: " + bandNames[scLink]);
  song = songNames[scLink];
  artist = bandNames[scLink];

  // removes excess characters from song/artist names
  if (song.includes("feat")) {
    song = song.split("feat")[0];
    // console.log("WORKING");
  }
  if (song.includes("(")) {
    song = song.split("(")[0];
  }
  if (song.includes(",")) {
    song = song.split(",")[0];
  }

  if (artist.includes("Ft")) {
    artist = artist.split("Ft")[0];
  }
  if (artist.includes("(")) {
    artist = artist.split("(")[0];
  }
  if (artist.includes(",")) {
    artist = artist.split(",")[0];
  }

  lyricsFinder(song, artist);
  scAdd(scLink);
});

$("#musicInput").on("keydown", function (event) {
  // reset all arrays
  $("body").attr("style", "overflow: visible;");
  $("#lyrics").attr("style", "display: none");
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
      scrollTop: $(".maincard").offset().top - 425
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
    frameId.attr("src", "https://www.youtube.com/embed/f02mOEt11OQ");
  } else if (y.toLowerCase() === "pop") {
    frameId.attr("src", "https://www.youtube.com/embed/Owg9esIqG_Y");
  } else if (y.toLowerCase() === "blues") {
    frameId.attr("src", "https://www.youtube.com/embed/qD9bZ7AQwPI");
  } else if (y.toLowerCase() === "punk") {
    frameId.attr("src", "https://www.youtube.com/embed/n5iuZkETnsE");
  } else if (y.toLowerCase() === "metal") {
    frameId.attr("src", "https://www.youtube.com/embed/j6niFit62ss");
  } else if (y.toLowerCase() === "r&b") {
    frameId.attr("src", "https://www.youtube.com/embed/4q2RH5-HBRE");
  } else if (y.toLowerCase() === "soul") {
    frameId.attr("src", "https://www.youtube.com/embed/pN4ocNJSP6s");
  } else if (y.toLowerCase() === "jazz") {
    frameId.attr("src", "https://www.youtube.com/embed/Oxt4Ut_Q55I");
  } else if (y.toLowerCase() === "classical") {
    frameId.attr("src", "https://www.youtube.com/embed/tPO9jxUKIsc");
  } else if (y.toLowerCase() === "reggae") {
    frameId.attr("src", "https://www.youtube.com/embed/JPctC3HNLwM");
  } else if (y.toLowerCase() === "latin") {
    frameId.attr("src", "https://www.youtube.com/embed/XaWLdx_ake8");
  } else if (y.toLowerCase() === "world") {
    frameId.attr("src", "https://www.youtube.com/embed/NgN12_xNHb0");
  } else if (y.toLowerCase() === "hip hop") {
    frameId.attr("src", "https://www.youtube.com/embed/5qap5aO4i9A");
  } else if (y.toLowerCase() === "electronic") {
    frameId.attr("src", "https://www.youtube.com/embed/zdYzL6wkr0A");
  } else {
    alert("No youtube playlist available for this genre");
  }
}

$("#upButton").on("click", function () {
  $(function () {
    $("#upButton").on('click', function () {
      $("HTML, BODY").animate({
        scrollTop: 0
      }, 1000);
    });
  });
});

$('#downButton').click(function () {
  $('html, body').animate({
    scrollTop: 0
  }, 'slow');
  return false;
});


function pageOpen() {
  $("HTML, BODY").animate({
    scrollTop: 0
  }, 1000);

  // localstorage
  var c = localStorage.getItem("c");
  c = parseInt(c);
  for (var i = 0; i < c; i++) {
    var gnr = localStorage.getItem(count + " gnr");
    var ytl = localStorage.getItem(count + " ytl");
    var ytn = localStorage.getItem(count + " ytn");
    var scl = localStorage.getItem(count + " scl");
    var scn = localStorage.getItem(count + " scn");
  }
  if(isNaN(c)){
  return;
  }else{
      count = c + 1; 
      if(c > 0){
      for(var i = 0; i < c; i ++){
        var pl = $("<button>");
        pl.text(gnr[i]);
        $("#playlist").append(pl);
        
      }
    }
  }
}

function musicOnError(e) {
  console.log("error" + e);
}

// adds song to player and checks for errors

pageOpen();



// widget.bind(SC.Widget.Events.FINISH, function (eventData) {
//   iframe.src = "https://w.soundcloud.com/player/?url=https" + finalArray[x + 1] + "&auto_play=true)";

// });