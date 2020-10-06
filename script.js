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
var ytl = [];
var ytn = [];
var scl = [];
var scn = [];
var ytl1 = [];
var ytn1 = [];
var scl1 = [];
var scn1 = [];
var go = false;
var youTubeImages = [];
var get = false;
var lyricHolder = [];

// https://openwhyd.org/u/4d94501d1f78ac091dbc9b4d/playlist/10?format=links&limit=10000 - working to post 10000 links from adrians profile
function music(x) {
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/https://openwhyd.org/hot/" + x + "?format=json&limit=1000",
        method: "GET",
        error: function(e) {
            alert("connection issues");
        }

    }).then(function(response) {
        console.log(response);
        for (var i = 0; i < response.tracks.length; i++) {
            sl1.push(response.tracks[i].eId);
            sn1.push(response.tracks[i].name);
            youTubeImages.push(response.tracks[i].img);
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
        // console.log("original youtube link: " + songLinks);
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
        console.log("og sc names: ", sc);


        // added to music from soundcloud
        newArray = sc.map(function(i) {
            return i[0].split("https").pop();
        });
        // console.log("split https: " + newArray);

        // removes stream where it exists
        for (var i = 0; i < newArray.length; i++) {
            if (newArray[i].includes("/stream")) {
                finalArray[i] = newArray[i].slice(0, -7);
            } else {
                finalArray.push(newArray[i]);
            }
        }

        bandNames = scNames.map(function(n) {
            if (n[0].includes(" - ")) {
                return n[0].split(" - ")[0];
            } else if (n[0].includes(" -")) {
                return n[0].split(" -")[0];
            } else if (n[0].includes("- ")) {
                return n[0].split("- ")[0];
            } else if (n[0].includes("-")) {
                return n[0].split("-")[0];
            } else {
                return n;
            }
            // return n[0].split(" - ");
        });
        // console.log("first split band : " + bandNames);
        // grabs song names  - maps each piece of array and runs for each item
        sNames = scNames.map(function(n) {
            return n[0].split(" - ").pop();
        });
        console.log("snames: ", sNames);
        // end from soundcloud

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
        // count = count + 1;
    });
    // end music function
}

// checks if the song has available lyrics and for song id on musixmatch
function lyricsFinder(x, y) {
    console.log("x: ", x, "y: ", y);
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

        error: function(e) {
            alert("connection issues");

        }
    }).then(function(response) {
        console.log(response);

        if (response.message.header.available === 0) {
            $("#lyrics").attr("style", "display: none");
            console.log("no lyrics available");
            return;
        } else {
            var hasLyrics = response.message.body.track_list[0].track.has_lyrics;
            var trackId = response.message.body.track_list[0].track.track_id;
            if (hasLyrics === 1) {

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

        error: function(e) {
            alert("connection issues");
            $("#lyrics").attr("style", "display: none");
        }
    }).then(function(response) {
        // console.log("Musixmatch response: ");
        // console.log(response.message.body.lyrics.lyrics_body);
        // lyricHolder.length = 0;
        $("#lyrics").attr("style", "display: inline-block");
        $("#lyrics").empty();
        lyricHolder.push(response.message.body.lyrics.lyrics_body);
        console.log(lyricHolder);
        var lyricEle = $("<p>");
        lyricEle.text(lyricHolder[0]);
        lyricEle.attr("style", "margin-left: 60px; margin-top: 60px;");
        $("#lyrics").append(lyricEle);
        lyricHolder.length = 0;
    });
    // end lyrics
}

function youtube() {
    // for each item in songLinks - take 4 characters from the front of each item - provides youtube links
    remove4 = songLinks.map(s => s.slice(4));
    youtubeLinks = [];

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
        div.addClass("borderList");
        // wraps div tag with 'a' tag
        $("#" + i + "div").wrap("<a class = 'new'></a>");
        aTag.attr("href", youtubeLinks[i]).attr("target", "_blank");
        // aTag.attr("class", "p-05");
        // div.attr("style", "padding: 10px;");
    }
    var youtubeCon = $(".youtubeVId");
    // Append youtube links here. 
    for (i = 0; i < 16; i++) {

        var newDIV = $("<div>");
        var atag = $("<a>");
        var imgtag = $("<img>");
        atag.attr("href", youtubeLinks[i]);
        imgtag.attr("src", youTubeImages[i]).attr("class", "object-contain h-48 w-full");
        atag.append(imgtag);
        newDIV.append(atag);
        $("#" + i + "you").append(newDIV);
    }
}

function soundcloud() {
    // display soundcloud song names on id player - inserts numbers before name
    for (var i = 0; i < scNames.length; i++) {
        var li = $("<p>");
        li.attr("id", i);
        li.text((i + 1) + ": " + scNames[i]);
        li.addClass("borderList");
        $("#player").append(li);
    }

    // lyricsCheck(0);
    scAdd(0);
}

function scAdd(x) {
    var iframe = document.querySelector('#music');
    lyricsCheck(x);
    iframe.src = "https://w.soundcloud.com/player/?url=https" + finalArray[x] + "&auto_play=true)";
    // console.log("song playing: " + finalArray[x]);
    var widget = SC.Widget(iframe);
    // play next song on finish
    widget.bind(SC.Widget.Events.FINISH, function() {
        iframe.src = "https://w.soundcloud.com/player/?url=https" + finalArray[x++] + "&auto_play=true)";
    });
    widget.bind(SC.Widget.Events.ERROR, function(eventData) {
        if (x < 15) {
            // console.log(eventData);
            // $("#lyrics").empty();
            x++;
            lyricsCheck(x);
            iframe.src = "https://w.soundcloud.com/player/?url=https" + finalArray[x] + "&auto_play=true)";
            console.log("x = ", x);
            return;
        } else {
            return;
        }
    });
}

// plays song on click
$("#player").on("click", "p", function() {
    lyricHolder.length = 0;
    $("#lyrics").attr("style", "display: none");
    $("#lyrics").empty();
    var scLink = this.id;
    x = scLink;
    // lyricsCheck(scLink);
    // lyricsFinder(song, artist);
    scAdd(scLink);
});


function lyricsCheck(x) {

    song = sNames[x];
    artist = bandNames[x];
    console.log("song playing : " + song);
    console.log("artist playing: " + artist);

    // removes excess characters from song/artist names - split creates new array - 0 takes first piece of it before the split character
    if (song.includes("feat")) {
        song = song.split("feat")[0];
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
    console.log("LyricsCheck", song, artist);
    lyricsFinder(song, artist);

}

$("#musicInput").on("keydown", function(event) {
    go = false;
    // reset all arrays
    youTubeImages.length = 0;
    $(".youtuveVId").empty();
    $("body").attr("style", "overflow: visible;");
    $("#lyrics").attr("style", "display: none");
    $("#lyrics").empty();
    $("#player").empty();
    $("#youtube").empty();
    lyricHolder.length = 0;
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
    youTubeImages.length = 0;
    if (event.keyCode == 13) {
        $("#saveBtn").attr("style", "display: inline-block");
        go = true;
        var genre = $("#musicInput").val();
        // auto scroll to main content on enter
        $([document.documentElement, document.body]).animate({
            scrollTop: $(".maincard").offset().top - 425
        }, 2000);

        // console.log(genre);
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
        console.log("No youtube playlist available for this genre");
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
});

$('#downButton').click(function() {
    $('html, body').animate({
        scrollTop: $(".maincard").offset().top - 425
    }, 'slow');
    return false;
});

// save button
$("#saveBtn").on("click", function() {
    if (go) {
        $("#savedPlaylists").attr("style", "display: inline-block");
        $("#saved").attr("style", "display: inline-block");
        // $("#savedPlaylists").empty();
        localStorage.setItem("c", count);
        localStorage.setItem(count + " gnr", $("#musicInput").val());
        localStorage.setItem(count + " ytl", songLinks);
        localStorage.setItem(count + " ytn", songNames);
        localStorage.setItem(count + " scl", finalArray);
        localStorage.setItem(count + " scf", scNames);
        localStorage.setItem(count + " scn", sNames);
        localStorage.setItem(count + " scb", bandNames);
        localStorage.setItem(count + " yti", youTubeImages);
        var c = localStorage.getItem("c");
        // count = count + 1;
        // for(var i = 0; i < count + 1; i++){
        var playlist = $("<button>");
        playlist.text(localStorage.getItem(count + " gnr"));
        playlist.attr("value", count).attr("style", "padding: 20px; margin: 20px;");
        playlist.attr("class", " bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full");
        $("#savedPlaylists").append(playlist);
        // }
        count++;
    }

});

function local() {
    // localstorage
    var c = localStorage.getItem("c");
    c = parseInt(c);
    console.log("c: ", c);
    if (isNaN(c)) {
        $("#saved").attr("style", "display: none");
        $("#savedPlaylists").attr("style", "display: none");
    }


    // console.log("c: ", c);
    for (var i = 0; i < c + 1; i++) {
        gnr = localStorage.getItem(i + " gnr");
        ytl1 = localStorage.getItem(i + " ytl");
        ytn1 = localStorage.getItem(i + " ytn");
        scl1 = localStorage.getItem(i + " scl");
        scf1 = localStorage.getItem(i + " scf");
        scn1 = localStorage.getItem(i + " scn");
        scb1 = localStorage.getItem(i + " scb");
        yti1 = localStorage.getItem(i + " yti");
    }
    console.log("scn1: ", scn1);

    if (isNaN(c)) {
        return;
    } else {
        for (var i = 0; i < c + 1; i++) {
            var playlist = $("<button>");
            playlist.text(localStorage.getItem(i + " gnr"));
            playlist.attr("value", i).attr("style", "padding: 20px; margin: 20px;");
            playlist.attr("class", " bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full");
            $("#savedPlaylists").append(playlist);
        }
    }
    count = c + 1;
    // console.log("count: " + count);
}

$("#savedPlaylists").on("click", "button", function() {
    lyricHolder.length = 0;
    youTubeImages.length = 0;
    $(".youtuveVId").empty();
    $("body").attr("style", "overflow: visible;");
    $("#player").attr("style", "display: inline-block");
    $("#youtube").attr("style", "display: inline-block");

    var show = this.value;
    // console.log(show);

    gnr = localStorage.getItem(show + " gnr");

    ytl1 = localStorage.getItem(show + " ytl");
    ytn1 = localStorage.getItem(show + " ytn");
    scl1 = localStorage.getItem(show + " scl");
    scf1 = localStorage.getItem(show + " scf");
    scn1 = localStorage.getItem(show + " scn");
    scb1 = localStorage.getItem(show + " scb");
    yti1 = localStorage.getItem(show + " yti");

    console.log("saved genre as: ", gnr);
    console.log("saved youtube links as: ", ytl);
    console.log("saved youtube names as: ", ytn);
    console.log("saved soundcloud links as: ", scl);
    console.log("saved soundcloud names as: ", scn);

    $("#lyrics").empty();
    $("#player").empty();
    $("#youtube").empty();
    console.log("youtube links before split: ", ytl);

    ytl = ytl1.split(",");
    ytn = ytn1.split(",");
    scl = scl1.split(",");
    scf = scf1.split(",");
    scn = scn1.split(",");
    scb = scb1.split(",");
    yti = yti1.split(",");
    console.log("scn: ", scn);

    finalArray = scl;
    sNames = scn;
    bandNames = scb;
    songLinks = ytl;
    songNames = ytn;
    scNames = scf;
    youTubeImages = yti;

    genre = gnr;
    youtubePlay(genre);
    youtube();
    soundcloud();
    scAdd(0);
});

$("#clearBtn").on("click", function() {
    $("#savedPlaylists").attr("style", "display: none");
    $("#saved").attr("style", "display: none");
    localStorage.clear();
    $("#savedPlaylists").empty();
    count = 0;
});

// adds song to player and checks for errors
function pageOpen() {
    $("HTML, BODY").animate({
        scrollTop: 0
    }, 1000);
    $("#lyrics").attr("style", "display: none");
    $("#player").attr("style", "display: none");
    $("#youtube").attr("style", "display: none");
    $("#saveBtn").attr("style", "display: none");

}

pageOpen();
local();

$("#downButtonMainCard").on("click", function() {
    $([document.documentElement, document.body]).animate({
        scrollTop: $(".albumCover").offset().top
    }, 2000);
});

$("#UpButtonMainCard").on("click", function() {
    $(function() {
        $("#UpButtonMainCard").on('click', function() {
            $("HTML, BODY").animate({
                scrollTop: 0
            }, 1000);
        });
    });
});

// test auto play next song - not workng
// (function(){
//   var iframe = document.querySelector('#music');
//    var widget = SC.Widget(iframe);

//   widget.bind(SC.Widget.Events.FINISH, function() {
//     iframe.src = "https://w.soundcloud.com/player/?url=https" + finalArray[x++] + "&auto_play=true)";

//   });

// }());

// widget.bind(SC.Widget.Events.FINISH, function (eventData) {
//   iframe.src = "https://w.soundcloud.com/player/?url=https" + finalArray[x + 1] + "&auto_play=true)";

// }); // finalArray = newArray.map(x => x.slice(0, -7));


// });
// });{ // console.log("after split" + finalArray);
// adds working soundcloud link to soundcloud player
// $("#music").attr("src", "https://w.soundcloud.com/player/?url=https" + finalArray[0] + "&auto_play");
// grab soundcloud artist name

// console.log("first split song : " + sNames);o