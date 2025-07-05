console.log("Lets write javascript");
let currentSong = new Audio();
let songs;
let Globalindex;
let currFolder;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0)
    return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, `0`);
  const formattedSeconds = String(remainingSeconds).padStart(2, `0`);

  return `${formattedMinutes}:${formattedSeconds}`

}



async function getSongs(folder) {
  currFolder = folder;
  // console.log("THIS IS FOLDER ",currFolder);

  let a = await fetch(`http://127.0.0.1:3000/Spotify/${folder}`);
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    // console.log("THIS IS ELEMENT ",element);

    if (element.href.endsWith(".mp3")) {
      // console.log("THIS IS END WITH ELEMENT ", element.href.split(`${folder}`)[1]);

      let trim = (element.href.split(`${folder}`)[1]);
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
async function getSongsPlaylistCover() {
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
  console.log("ThiS IS TRACK : ", track);

  currentSong.src = track;
  if (pause) {
    play.src = "assets/pause.svg";
    currentSong.play();

  }

  let c = currentSong.src.split("/").slice(-1)[0];
  c = c.split(".mp3")[0];
  Globalindex = songs.indexOf(c);


  let trim = track.split(`${currFolder}`)[1];
  trim = trim.split(".mp3")[0];
  console.log(decodeURIComponent(trim));

  document.querySelector(".player-card").getElementsByTagName("div")[2].querySelector(".p1").innerHTML = decodeURIComponent(trim);

  let coverMp = track.replace(".mp3", ".jpeg")
  let cover = coverMp.replace("/songs/LikedSongs/", "/songcover/")

  document.querySelector(".player-card").querySelector(".playlist-card-img").querySelector(".player-card-img").src = cover;



}



async function main() {


  let homeSongs = await getSongs("/songs/LikedSongs/");

  //get the list of all the songs
  songs = await getSongs("/songs/LikedSongs/");
  console.log("SONGS ", songs);

  playMusic(`http://127.0.0.1:3000/Spotify${currFolder}${songs[0]}.mp3`, false);





  //get the list of songHomeCover link
  let songsCover = await getSongsCover();
  console.log("Song Cover ", songsCover);

  let songUl = document.querySelector(".bg").getElementsByTagName("div")[1];

  //home div trending songs
  for (const song of homeSongs) {
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
      // console.log("THE CARD IS CLICKED");

      // console.log(e.querySelector(".playlist-card-content").firstElementChild.innerHTML);

      console.log(`http://127.0.0.1:3000/Spotify${currFolder}${encodeURIComponent(card.querySelector(".title").innerHTML)}.mp3`);

      playMusic(`http://127.0.0.1:3000/Spotify${currFolder}${encodeURIComponent(card.querySelector(".title").innerHTML)}.mp3`, true);

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
      playMusic(`http://127.0.0.1:3000/Spotify${currFolder}${(songs[index - 1])}.mp3`, true);
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
      playMusic(`http://127.0.0.1:3000/Spotify${currFolder}${(songs[index + 1])}.mp3`, true);
    }

    // else{
    //   playMusic(`http://127.0.0.1:3000/Spotify/songs/${(songs[0])}.mp3`, true);
    // }


  })

  //add eventlistener when the currentTime is equal to duration
  currentSong.addEventListener("timeupdate", () => {

    if ((currentSong.duration - currentSong.currentTime < 0.3) && ((Globalindex + 1) < songs.length)) {
      // index++;
      playMusic(`http://127.0.0.1:3000/Spotify${currFolder}${(songs[Globalindex + 1])}.mp3`, true);
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
    if (currentSong.volume > 0) {
      document.querySelector(".volume >button> img").src = document.querySelector(".volume >button> img").src.replace("assets/volumeOff.svg", "assets/volume.svg");
    }
  })

  //Add event listener to mute the track
  document.querySelector(".volume > button").addEventListener("click", (e) => {
    // console.log(e.target);
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




  //to display all the playlist
  // displayAlbums();
  let a = await fetch(`http://127.0.0.1:3000/Spotify/songs/`);
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let cardContainer = document.querySelector(".playlist");
  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-2)[0];
      let check = e.href.split("/songs/")[1];

    



      if (check === '.DS_Store') continue ; // 🧹 Skip .DS_Store

      // get the metadata of the folder

      let a = await fetch(`http://127.0.0.1:3000/Spotify/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);

      cardContainer.innerHTML = cardContainer.innerHTML +
        `

        <div data-folder="${folder}" class="playlist-card">
        <div  class="playlist-card-img">
            <img src="http://127.0.0.1:3000/Spotify/songs/${folder}/cover.jpeg"
                alt="">
            <div class="overlay"></div>
            <img class="overplay invert" src="assets/play.svg" alt="">
        </div>
        <div class="playlist-card-content">
            <p class="p1">${response.title}</p>
            <p class="p2">
                <svg data-encore-id="icon" role="img" aria-hidden="false"
                    class="e-9960-icon e-9960-baseline cSWBDsMjkH62GXIXo6mQ" viewBox="0 0 16 16"
                    style="--encore-icon-fill: var(--text-bright-accent, #107434); --encore-icon-height: var(--encore-graphic-size-informative-smaller-2); --encore-icon-width: var(--encore-graphic-size-informative-smaller-2);">
                    <title>Pinned</title>
                    <path
                        d="M8.822.797a2.72 2.72 0 0 1 3.847 0l2.534 2.533a2.72 2.72 0 0 1 0 3.848l-3.678 3.678-1.337 4.988-4.486-4.486L1.28 15.78a.75.75 0 0 1-1.06-1.06l4.422-4.422L.156 5.812l4.987-1.337z">
                    </path>
                </svg>

                Playlist • Spotify
            </p>
        </div>
    </div>

        `
    }
  }

  


//playlist starts

  let playlistCover = await getSongsPlaylistCover();

  //playlist 
  document.querySelector(".playlist").querySelectorAll(".playlist-card").forEach(e => 

    {
    e.addEventListener("click", async (e) => {
      console.log("THIS IS TARGET : ",e.currentTarget);



      let target = e.currentTarget;
      let playlistImg = target.querySelector(".playlist-card-img>img").src;

      currFolder = `/songs/${e.currentTarget.dataset.folder}/`;

      let PlaylistTitle = currFolder.split("/songs/")[1];
      PlaylistTitle = decodeURIComponent(PlaylistTitle.replace("/", ""));

      songs = await getSongs(`/songs/${e.currentTarget.dataset.folder}/`);

      document.querySelector(".right").innerHTML = "";
      document.querySelector(".right").innerHTML = document.querySelector(".right").innerHTML +
        `
         <div class="bg-right">
                <div class="spotifylikedheading">
                    <img src="${playlistImg}" alt="">
                    <h1 class="h1">${PlaylistTitle}</h1>
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

          playMusic(`http://127.0.0.1:3000/Spotify${currFolder}${encodeURIComponent(e.querySelector(".playlist-card-content").firstElementChild.innerHTML)}.mp3`, true);

        });

      });



    })



  })







}

main();
