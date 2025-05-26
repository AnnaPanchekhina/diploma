const API_KEY = '6409a29c7a720dd6499bbd419ef91ce2';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const artistsContainer = document.getElementById('artists-container');
const tracksContainer = document.getElementById('tracks-container');
const loading = document.getElementById('loading');
const errorDisplay = document.getElementById('error');

async function performSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
        showError('Please enter search term');
        return;
    }

    try {
        if (loading) loading.style.display = 'block';
        
        document.getElementById('main-page').classList.add('hidden');
        document.getElementById('search-results').style.display = 'block';
        
        const artist = await getArtistInfo(query);
        if (artist) {
            renderArtistProfile(artist);
            
            const albums = await getArtistAlbums(artist.name);
            if (albums) renderAlbums(albums);
            
            const tracks = await getArtistTopTracks(artist.name);
            if (tracks) renderArtistTracks(tracks);
        }
        
    } catch (error) {
        showError('Search failed: ' + error.message);
    } finally {
        if (loading) loading.style.display = 'none';
    }
}

async function getArtistInfo(artistName) {
    const params = new URLSearchParams({
        method: 'artist.getInfo',
        artist: artistName,
        api_key: API_KEY,
        format: 'json'
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();
    return data?.artist;
}

async function getArtistAlbums(artistName) {
    const params = new URLSearchParams({
        method: 'artist.getTopAlbums',
        artist: artistName,
        api_key: API_KEY,
        format: 'json',
        limit: 8
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();
    return data?.topalbums?.album;
}

async function getArtistTopTracks(artistName) {
    const params = new URLSearchParams({
        method: 'artist.getTopTracks',
        artist: artistName,
        api_key: API_KEY,
        format: 'json',
        limit: 10
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();
    return data?.toptracks?.track;
}

function renderArtistProfile(artist) {
    const profileContainer = document.getElementById('artist-profile');
    if (!profileContainer) return;
    
    profileContainer.innerHTML = `
        <div class="artist-profile-photo" 
             style="background-image: url('${artist.image[3]?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'}')">
        </div>
        <div class="artist-profile-info">
            <h1>${artist.name}</h1>
        </div>
    `;
}

function renderAlbums(albums) {
    const albumsContainer = document.getElementById('albums-container');
    if (!albumsContainer) return;
    
    albumsContainer.innerHTML = albums.map(album => `
        <div class="album">
            <div class="album-cover" 
                 style="background-image: url('${album.image[2]?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'}')">
            </div>
            <div class="album-info">
                <h3>${album.name}</h3>
            </div>
        </div>
    `).join('');
}

function renderArtistTracks(tracks) {
    const tracksContainer = document.getElementById('artist-tracks-container');
    if (!tracksContainer) return;
    
    tracksContainer.innerHTML = tracks.map((track, index) => `
        <div class="track">
            <span class="track-number">${index + 1}</span>
            <div class="track-photo" 
                 style="background-image: url('${track.image[2]?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'}')">
            </div>
            <div class="track-info">
                <h3>${track.name}</h3>
            </div>
        </div>
    `).join('');
}

async function loadInitialData() {
    try {
        if (loading) loading.style.display = 'block';
        const [artists, tracks] = await Promise.all([
            fetchTop('artist'),
            fetchTop('track')
        ]);
        if (artistsContainer && artists) renderInitialArtists(artists);
        if (tracksContainer && tracks) renderInitialTracks(tracks);
    } catch (error) {
        showError('Failed to load initial data: ' + error.message);
    } finally {
        if (loading) loading.style.display = 'none';
    }
}

async function fetchTop(type) {
    const params = new URLSearchParams({
        method: `chart.gettop${type}s`,
        api_key: API_KEY,
        format: 'json',
        limit: 8
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();
    return data[`${type}s`]?.[`${type}`] || [];
}

function renderInitialArtists(artists) {
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

function renderInitialTracks(tracks) {
    tracksContainer.innerHTML = tracks.map(track => `
        <div class="track">
            <div class="track-photo" 
                 style="background-image: url('${track.image[2]?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'}')">
            </div>
            <div class="track-info">
                <h3>${track.name}</h3>
                <p>${track.artist?.name || 'Unknown Artist'}</p>
            </div>
        </div>
    `).join('');
}

function showError(message) {
    if (errorDisplay) {
        errorDisplay.textContent = message;
        errorDisplay.style.display = 'block';
        setTimeout(() => {
            if (errorDisplay) errorDisplay.style.display = 'none';
        }, 5000);
    }
}

if (searchBtn) searchBtn.addEventListener('click', performSearch);
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

document.getElementById('back-to-home').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('main-page').classList.remove('hidden');
    document.getElementById('search-results').style.display = 'none';
    searchInput.value = '';
});

document.addEventListener('DOMContentLoaded', loadInitialData);