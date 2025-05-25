// Конфигурация API
const API_KEY = '6409a29c7a720dd6499bbd419ef91ce2'; // Замените на ваш ключ
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

// Элементы DOM
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const artistsContainer = document.getElementById('artists-container');
const tracksContainer = document.getElementById('tracks-container');
const loading = document.getElementById('loading');
const errorDisplay = document.getElementById('error');

// Функция для выполнения поиска
async function performSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
        showError('Please enter search term');
        return;
    }

    try {
        loading.style.display = 'block';
        artistsContainer.innerHTML = '';
        tracksContainer.innerHTML = '';
        
        // Ищем артистов
        const artists = await searchLastFM(query, 'artist');
        renderArtists(artists);
        
        // Ищем треки
        const tracks = await searchLastFM(query, 'track');
        renderTracks(tracks);
        
    } catch (error) {
        showError('Search failed: ' + error.message);
    } finally {
        loading.style.display = 'none';
    }
}

// Функция для запроса к Last.fm API
async function searchLastFM(query, type) {
    const params = new URLSearchParams({
        method: `${type}.search`,
        [`${type}`]: query,
        api_key: API_KEY,
        format: 'json',
        limit: 8
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results[`${type}matches`][`${type}`];
}

// Функции рендеринга
function renderArtists(artists) {
    artistsContainer.innerHTML = artists.map(artist => `
        <div class="artist">
            <div class="artist-photo" 
                 style="background-image: url('${artist.image[2]?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'}')">
            </div>
            <div class="artist-info">
                <h3>${artist.name}</h3>
            </div>
        </div>
    `).join('');
}

function renderTracks(tracks) {
    tracksContainer.innerHTML = tracks.map(track => `
        <div class="track">
            <div class="track-photo" 
                 style="background-image: url('${track.image[2]?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'}')">
            </div>
            <div class="track-info">
                <h3>${track.name}</h3>
                <p>${track.artist}</p>
            </div>
        </div>
    `).join('');
}

// Функция показа ошибок
function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
    setTimeout(() => {
        errorDisplay.style.display = 'none';
    }, 5000);
}

// Обработчики событий
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

// Загрузка начальных данных
async function loadInitialData() {
    try {
        loading.style.display = 'block';
        const [artists, tracks] = await Promise.all([
            fetchTop('artist'),
            fetchTop('track')
        ]);
        renderArtists(artists);
        renderTracks(tracks);
    } catch (error) {
        showError('Failed to load initial data: ' + error.message);
    } finally {
        loading.style.display = 'none';
    }
}

// Функция для получения топовых данных
async function fetchTop(type) {
    const params = new URLSearchParams({
        method: `chart.gettop${type}s`,
        api_key: API_KEY,
        format: 'json',
        limit: 8
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();
    return data[`${type}s`][`${type}`];
}

// Инициализация
document.addEventListener('DOMContentLoaded', loadInitialData);