console.log("Lets write javascript");
let currentSong = new Audio();
let songs;
let Globalindex;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0)
    return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, `0`);
  const formattedSeconds = String(remainingSeconds).padStart(2, `0`);

  return `${formattedMinutes}:${formattedSeconds}`

}



async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/Spotify/songs/Liked%20songs/");
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      let trim = (element.href.split("/songs/Liked%20songs/")[1]);
      songs.push(trim.split(".mp3")[0]);

    }
  }
  return songs;

}

async function getSongsCover() {
  let a = await fetch("http://127.0.0.1:3000/Spotify/songcover/HomeCover/")
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songsCover = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".jpeg") || element.href.endsWith(".png") || element.href.endsWith(".jpg")) {
      songsCover.push(element.href);
    }
  }
  return songsCover;

}

//function for getting the cover of the playlist
async function getSongsPlaylistCover(){
  let a = await fetch("http://127.0.0.1:3000/Spotify/songcover/")
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songsCover = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".jpeg") || element.href.endsWith(".png") || element.href.endsWith(".jpg")) {
      songsCover.push(element.href);
    }
  }
  return songsCover;
}

const playMusic = (track, pause = true) => {
  // let audio = new Audio(track);
  currentSong.src = track;
  if (pause) {
    play.src = "assets/pause.svg";
    currentSong.play();

  }

  let c = currentSong.src.split("/").slice(-1)[0];
  c = c.split(".mp3")[0];
  Globalindex = songs.indexOf(c);


  let trim = track.split("/songs/Liked%20songs/")[1];
  trim = trim.split(".mp3")[0];
  console.log(decodeURIComponent(trim));

  document.querySelector(".player-card").getElementsByTagName("div")[2].querySelector(".p1").innerHTML = decodeURIComponent(trim);

  let coverMp = track.replace(".mp3", ".jpeg")
  let cover = coverMp.replace("/songs/Liked%20songs/", "/songcover/")

  document.querySelector(".player-card").querySelector(".playlist-card-img").querySelector(".player-card-img").src = cover;



}

async function main() {

  //get the list of all the songs
  songs = await getSongs();
  console.log(songs);

  playMusic(`http://127.0.0.1:3000/Spotify/songs/Liked%20songs/${songs[0]}.mp3`, false);





  //get the list of songHomeCover link
  let songsCover = await getSongsCover();
  console.log(songsCover);

  let songUl = document.querySelector(".bg").getElementsByTagName("div")[1];

  //home div trending songs
  for (const song of songs) {
    let matchingCover = songsCover.find(coverUrl => {
      let baseCoverName = (coverUrl.split("/songcover/HomeCover/")[1]);  // e.g. "blue.jpeg"
      baseCoverName = baseCoverName.replace(/\.(jpeg|jpg|png)$/i, ""); // removes extension 
      return baseCoverName === song;
    });


    // Fallback if no cover found
    if (!matchingCover) {
      matchingCover = "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72ce007471b8e11006b082d59fa"; // or use a default image URL
    }
    else {
      let fileName = matchingCover.split("/songcover/HomeCover")[1];
      matchingCover = `http://127.0.0.1:3000/Spotify/songcover/HomeCover/${encodeURIComponent(fileName)}`


    }

    songUl.innerHTML = songUl.innerHTML +
      `
      <div class="card">
                        <div class="play">
                            <button>
                                <img src="assets/play.svg" alt="">
                            </button>
                        </div>
                        <img src="${matchingCover}" alt="">
                        <span class="title hovering">${decodeURIComponent(song)}</span>
                        <div class="artist">
                            <span class="encore-text-small-artist">
                                <a class="hovering"
                                    href="https://open.spotify.com/artist/1wRPtKGflJrBx9BmLsSwlU">Ayush</a>
                                
                            </span>
                        </div>
                    </div>


      `
  }



  // Attach an event listener to each song 
  document.querySelector(".cardContainer").querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      console.log("THE CARD IS CLICKED");

      // console.log(e.querySelector(".playlist-card-content").firstElementChild.innerHTML);

      console.log(`http://127.0.0.1:3000/Spotify/songs/Liked%20songs/${encodeURIComponent(card.querySelector(".title").innerHTML)}.mp3`);

      playMusic(`http://127.0.0.1:3000/Spotify/songs/Liked%20songs/${encodeURIComponent(card.querySelector(".title").innerHTML)}.mp3`, true);

    });

  });

  //attach an event listener to play, next and previous

  play_button.addEventListener("click", () => {


    if (currentSong.paused) {
      currentSong.play();
      play.src = "assets/pause.svg";

    }
    else {
      currentSong.pause();
      play.src = "assets/play.svg";

    }
  })

  //listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {

    document.querySelector(".endTime").innerHTML = `${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".startTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}`;

    document.querySelector(".widthbar").style.width = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    document.querySelector(".bar-circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

  })

  //add an event listerner to seek bar
  document.querySelector(".bar").addEventListener("click", e => {
    let bounding = (e.offsetX / document.querySelector(".bar").getBoundingClientRect().width) * 100;

    document.querySelector(".widthbar").style.width = (bounding + "%");

    document.querySelector(".bar-circle").style.left = (bounding + "%");

    currentSong.currentTime = (currentSong.duration) * bounding / 100;

  })


  //add event listerner for hamburger
  document.querySelector(".hamburger-img").addEventListener("click", () => {
    const open = document.querySelector(".left").style.left;
    console.log("hi I am hamburger");

    if (open === "0%") {
      document.querySelector(".left").style.left = "-100%";
      document.querySelector(".hamburger-img").src = "assets/closehamburger.svg";
    }
    else {
      document.querySelector(".left").style.left = "0%";
      document.querySelector(".hamburger-img").src = "assets/hamburger.svg";
    }

  })


  //add eventlisterner to make the header a boxshadow
  // const headingPlaylist = document.getElementById("headingPlaylist");
  // headingPlaylist.addEventListener("scroll", () => {

  //   console.log("SCROLLED");

  // });


  //add an event listener to previous 
  previous.addEventListener("click", () => {
    console.log("previous");
    let c = currentSong.src.split("/").slice(-1)[0];
    c = c.split(".mp3")[0];

    let index = songs.indexOf(c);

    if ((index - 1) >= 0) {
      playMusic(`http://127.0.0.1:3000/Spotify/songs/Liked%20songs/${(songs[index - 1])}.mp3`, true);
    }

    // else{
    //     playMusic(`http://127.0.0.1:3000/Spotify/songs/${(songs[songs.length-1])}.mp3`, true);

    // }

  })

  //add an event listener to next
  next.addEventListener("click", () => {
    console.log("next");
    let c = currentSong.src.split("/").slice(-1)[0];
    c = c.split(".mp3")[0];

    index = songs.indexOf(c);


    if ((index + 1) < songs.length) {
      playMusic(`http://127.0.0.1:3000/Spotify/songs/Liked%20songs/${(songs[index + 1])}.mp3`, true);
    }

    // else{
    //   playMusic(`http://127.0.0.1:3000/Spotify/songs/${(songs[0])}.mp3`, true);
    // }


  })

  //add eventlistener when the currentTime is equal to duration
  currentSong.addEventListener("timeupdate", () => {

    if ((currentSong.duration - currentSong.currentTime < 0.3) && ((Globalindex + 1) < songs.length)) {
      console.log("SONG ENDED");
      // index++;
      playMusic(`http://127.0.0.1:3000/Spotify/songs/Liked%20songs/${(songs[Globalindex + 1])}.mp3`, true);
    }
  }
  )

  //volume slider
  const slider = document.getElementById('volumeSlider');

  const updateSliderBackground = (slider) => {
    const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #1ec758 ${value}%, #ccc ${value}%)`;
  };

  // Set initial background
  updateSliderBackground(slider);

  // Update on input
  slider.addEventListener('input', () => updateSliderBackground(slider));


  //add evenlistener to change volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log(e,);
    currentSong.volume = parseInt(e.target.value) / 100;
    if(currentSong.volume > 0){
      document.querySelector(".volume >button> img").src = document.querySelector(".volume >button> img").src.replace("assets/volumeOff.svg", "assets/volume.svg");
    }
  })

  //Add event listener to mute the track
  document.querySelector(".volume > button").addEventListener("click", (e) => {
    console.log(e.target);
    if (e.target.src.includes("assets/volume.svg")) {
      e.target.src = e.target.src.replace("assets/volume.svg", "assets/volumeOff.svg");
      currentSong.volume = 0;
      slider.value = 0;
      updateSliderBackground(slider);
    }
    else {
      e.target.src = e.target.src.replace("assets/volumeOff.svg", "assets/volume.svg");
      currentSong.volume = .10;
      slider.value = 10;
      updateSliderBackground(slider);
    }

  })






  
  let playlistCover = await getSongsPlaylistCover();
  //playlist 
  document.querySelector(".playlist").querySelectorAll(".playlist-card").forEach(e => {
    e.addEventListener("click", (e) => {
      console.log("THIS IS TARGET : ",e.currentTarget);
      
      let target = e.currentTarget;
      let playlistImg = target.querySelector(".playlist-card-img>img").src;


    
      document.querySelector(".right").innerHTML = "";
      document.querySelector(".right").innerHTML = document.querySelector(".right").innerHTML +
        `
         <div class="bg-right">
                <div class="spotifylikedheading">
                    <img src="${playlistImg}" alt="">
                    <h1 class="h1">Liked songs</h1>
                    <!-- <span class="hovering">Show all</span> -->
                </div>
                
            </div>

            <div class="right-songlist" id="right-songlist">
                <ul>
                   
                </ul>

      `

      
      //playlist div change
      let songsUl = document.querySelector(".right-songlist").getElementsByTagName("ul")[0];


      for (const song of songs) {
        let matchingCover = playlistCover.find(coverUrl => {
          let baseCoverName = (coverUrl.split("/songcover/")[1]);  // e.g. "blue.jpeg"
          baseCoverName = baseCoverName.replace(/\.(jpeg|jpg|png)$/i, ""); // removes extension 
          return baseCoverName === song;
        });


        // Fallback if no cover found
        if (!matchingCover) {
          matchingCover = "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72ce007471b8e11006b082d59fa"; // or use a default image URL
        }
        else {
          let fileName = matchingCover.split("/songcover/")[1];
          matchingCover = `http://127.0.0.1:3000/Spotify/songcover/${encodeURIComponent(fileName)}`


        }

        songsUl.innerHTML = songsUl.innerHTML +
          `
    <li>
                        <div class="playlist-card">
                            <div class="playlist-card-img">
                                <img src="${matchingCover}"
                                    alt="">
                                <div class="overlay"></div>
                              <img class="overplay invert" src="assets/play.svg" alt="">
                            </div>
                            <div class="playlist-card-content">
                                <p class="p1 hovering">${decodeURIComponent(song)}</p>
                                        <p class="p2">
                                            
            
                                           Ayush
                                        </p>
                            </div>
                        </div>
                    </li>

    `
      }

      //Attach an event listener to each song 
      Array.from(document.querySelector(".right-songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

          // console.log(e.querySelector(".playlist-card-content").firstElementChild.innerHTML);

          playMusic(`http://127.0.0.1:3000/Spotify/songs/Liked%20songs/${encodeURIComponent(e.querySelector(".playlist-card-content").firstElementChild.innerHTML)}.mp3`, true);

        });

      });



    })

  })




}

main();
