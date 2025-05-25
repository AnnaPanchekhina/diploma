const API_KEY = '6409a29c7a720dd6499bbd419ef91ce2';
const API_URL = 'https://ws.audioscrobbler.com/2.0/';

document.addEventListener('DOMContentLoaded', () => {
  // Загрузка топовых данных
  loadTopData();
  
  // Обработчики событий
  document.querySelector('.search-button').addEventListener('click', handleSearch);
  document.querySelector('.search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
});

async function fetchData(method, params = {}) {
  const query = new URLSearchParams({
    method,
    api_key: API_KEY,
    format: 'json',
    ...params
  });

  try {
    const response = await fetch(`${API_URL}?${query}`);
    if (!response.ok) throw new Error('Ошибка сети');
    const data = await response.json();
    if (data.error) throw new Error(data.message);
    return data;
  } catch (error) {
    alert(`Ошибка: ${error.message}`);
    return null;
  }
}

async function loadTopData() {
  const [artists, tracks] = await Promise.all([
    fetchData('chart.gettopartists', { limit: 15 }),
    fetchData('chart.gettoptracks', { limit: 15 })
  ]);

  if (artists) renderArtists(artists.artists.artist);
  if (tracks) renderTracks(tracks.tracks.track);
}

function renderArtists(artists) {
  const grid = document.querySelector('.artists-grid');
  grid.innerHTML = artists.map(artist => `
    <div class="artist-card">
      <img src="${artist.image[2]?.['#text'] || 'https://via.placeholder.com/150'}" 
           alt="${artist.name}" 
           class="artist-image">
      <p class="artist-name">${artist.name}</p>
      <p class="artist-listeners">${Number(artist.listeners).toLocaleString()} слушателей</p>
    </div>
  `).join('');
}

function renderTracks(tracks) {
  const list = document.querySelector('.tracks-list');
  list.innerHTML = tracks.map((track, i) => `
    <div class="track">
      <span class="track-number">${i + 1}</span>
      <span class="track-name">${track.name}</span>
      <span class="track-artist">${track.artist.name}</span>
      <span class="track-plays">${Number(track.playcount).toLocaleString()} прослушиваний</span>
    </div>
  `).join('');
}

async function handleSearch() {
  const query = document.querySelector('.search-input').value.trim();
  if (!query) return;

  const data = await fetchData('artist.search', { artist: query, limit: 10 });
  if (!data) return;

  const artists = data.results?.artistmatches?.artist || [];
  if (artists.length === 0) {
    alert('Исполнители не найдены');
    return;
  }

  renderArtists(artists);
}