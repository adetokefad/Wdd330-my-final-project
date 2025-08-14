// ======================
// Elements
// ======================
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const genreFilter = document.getElementById("genreFilter");
const songsContainer = document.getElementById("songsContainer");
const playlistContainer = document.getElementById("playlistContainer");

// ======================
// Playlist array (localStorage)
// ======================
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ======================
// RapidAPI setup
// ======================
const RAPIDAPI_HOST = "deezerdevs-deezer.p.rapidapi.com";
const RAPIDAPI_KEY = "89f6fdf417mshd13f35653518679p1e37f9jsna4ff5a5cf2f1";

// ======================
// Fetch songs from Deezer
// ======================
async function fetchSongs(query) {
  try {
    songsContainer.innerHTML = "<p>Loading songs...</p>";

    const res = await fetch(
      `https://${RAPIDAPI_HOST}/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      }
    );

    const data = await res.json();
    songsContainer.innerHTML = "";

    if (!data.data || data.data.length === 0) {
      songsContainer.innerHTML = "<p>No songs found. Try another search.</p>";
      return;
    }

    data.data.forEach((song) => createSongCard(song));
  } catch (err) {
    console.error("API fetch error:", err);
    songsContainer.innerHTML = "<p>Failed to load songs.</p>";
  }
}

// ======================
// Create song card
// ======================
function createSongCard(song) {
  const card = document.createElement("div");
  card.classList.add("song-card");

  card.innerHTML = `
    <img src="${song.album.cover_medium}" alt="${song.title}" />
    <h4>${song.title}</h4>
    <p>${song.artist.name}</p>
    <audio controls>
      <source src="${song.preview}" type="audio/mpeg" />
    </audio>
    <button class="save-btn">💚 Save to Playlist</button>
  `;

  // Save button click
  card.querySelector(".save-btn").addEventListener("click", () => {
    addToPlaylist(song);
  });

  songsContainer.appendChild(card);
}

// ======================
// Add song to playlist
// ======================
function addToPlaylist(song) {
  if (favorites.some((item) => item.id === song.id)) {
    alert("This song is already in your playlist!");
    return;
  }

  const songData = {
    id: song.id,
    title: song.title,
    artist: song.artist.name,
    albumCover: song.album.cover_medium,
  };

  favorites.push(songData);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderPlaylist();
}

// ======================
// Render playlist (re-fetch preview URLs)
// ======================
async function renderPlaylist() {
  playlistContainer.innerHTML = "";

  if (favorites.length === 0) {
    playlistContainer.innerHTML = "<p>Your playlist is empty.</p>";
    return;
  }

  for (let fav of favorites) {
    try {
      const res = await fetch(`https://${RAPIDAPI_HOST}/track/${fav.id}`, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      });
      const song = await res.json();

      const card = document.createElement("div");
      card.classList.add("song-card");

      card.innerHTML = `
        <img src="${fav.albumCover}" alt="${fav.title}" />
        <h4>${fav.title}</h4>
        <p>${fav.artist}</p>
        <audio controls>
          <source src="${song.preview}" type="audio/mpeg" />
        </audio>
        <button class="remove-btn">❌ Remove</button>
      `;

      // Remove from playlist
      card.querySelector(".remove-btn").addEventListener("click", () => {
        favorites = favorites.filter((item) => item.id !== fav.id);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderPlaylist();
      });

      playlistContainer.appendChild(card);
    } catch (err) {
      console.error(`Error fetching track ${fav.id}:`, err);
    }
  }
}

// ======================
// Search button click
// ======================
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  const genre = genreFilter.value;

  if (genre && !query) {
    fetchSongs(`genre:"${genre}"`);
  } else if (query) {
    fetchSongs(query);
  } else {
    alert("Please enter a search term or select a genre.");
  }
});

// ======================
// Page load actions
// ======================
document.addEventListener("DOMContentLoaded", () => {
  renderPlaylist();
  fetchSongs("Burna Boy"); // Default songs when opening page
});
