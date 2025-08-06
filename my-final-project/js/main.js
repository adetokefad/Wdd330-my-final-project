// Get the container where we'll place the cards

/**
 * Creates and appends a song card to the DOM
 * @param {Object} song - A song object from the Deezer API
 */
function createSongCard(song) {
  // Create the card wrapper
  const card = document.createElement("div");
  card.classList.add("song-card");

  // Add song content to the card
  card.innerHTML = `
    <img src="${song.album.cover_medium}" alt="Album Art for ${song.title}" />
    <h4>${song.title}</h4>
    <p>${song.artist.name}</p>
    <audio controls>
      <source src="${song.preview}" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
    <button class="save-btn" data-id="${song.id}">💚 Save to Playlist</button>
  `;

  // Append the card to the songs grid container
  songsContainer.appendChild(card);
}

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const genreFilter = document.getElementById("genreFilter");
const songsContainer = document.getElementById("songsContainer");

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
const API_URL = "https://api.deezer.com/search?q=";

// Listen for search
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  const genre = genreFilter.value;

  if (!query && !genre) {
    alert("Please enter a search term or select a genre.");
    return;
  }

  let finalQuery = query;
  if (genre && !query) {
    finalQuery = `genre:"${genre}"`;
  }

  fetchSongs(finalQuery);
});

// Fetch music
async function fetchSongs(query) {
  try {
    songsContainer.innerHTML = "<p>Loading...</p>";
    const response = await fetch(
      `${CORS_PROXY}${API_URL}${encodeURIComponent(query)}`
    );
    const data = await response.json();

    songsContainer.innerHTML = ""; // Clear previous results

    if (data.data.length === 0) {
      songsContainer.innerHTML = "<p>No results found. Try another search.</p>";
      return;
    }

    data.data.forEach((song) => createSongCard(song));
  } catch (err) {
    console.error("Error fetching songs:", err);
    songsContainer.innerHTML = "<p>Error loading songs. Try again later.</p>";
  }
}

// Reuse this from earlier
function createSongCard(song) {
  const card = document.createElement("div");
  card.classList.add("song-card");

  card.innerHTML = `
    <img src="${song.album.cover_medium}" alt="Album Art for ${song.title}" />
    <h4>${song.title}</h4>
    <p>${song.artist.name}</p>
    <audio controls>
      <source src="${song.preview}" type="audio/mpeg" />
    </audio>
    <button class="save-btn" data-id="${song.id}" data-song='${JSON.stringify(
    song
  )}'>💚 Save to Playlist</button>
  `;

  songsContainer.appendChild(card);
}
