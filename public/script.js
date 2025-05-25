/**
 * Last.fm API Client
 * @namespace LastFM
 */
const LastFM = (() => {
    const API_KEY = '6409a29c7a720dd6499bbd419ef91ce2'; 
    const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

    /**
     * Fetch data from Last.fm API
     * @param {Object} params - API parameters
     * @returns {Promise<Object>} - Parsed JSON response
     */
    const fetchData = async (params) => {
        const urlParams = new URLSearchParams({
            ...params,
            api_key: API_KEY,
            format: 'json'
        });

        try {
            const response = await fetch(`${BASE_URL}?${urlParams}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };

    return {
        /**
         * Get top artists
         * @param {number} limit - Number of artists to fetch
         * @returns {Promise<Array>} - Array of top artists
         */
        async getTopArtists(limit = 8) {
            const data = await fetchData({
                method: 'chart.gettopartists',
                limit
            });
            return data.artists.artist;
        },

        /**
         * Get top tracks
         * @param {number} limit - Number of tracks to fetch
         * @returns {Promise<Array>} - Array of top tracks
         */
        async getTopTracks(limit = 12) {
            const data = await fetchData({
                method: 'chart.gettoptracks',
                limit
            });
            return data.tracks.track;
        },

        /**
         * Search for artists or tracks
         * @param {string} query - Search query
         * @param {string} type - 'artist' or 'track'
         * @param {number} limit - Number of results
         * @returns {Promise<Array>} - Search results
         */
        async search(query, type, limit = 10) {
            const data = await fetchData({
                method: `${type}.search`,
                [type]: query,
                limit
            });
            return data.results[`${type}matches`][`${type}`];
        }
    };
})();

/**
 * DOM Manipulation and Event Handling
 */
document.addEventListener('DOMContentLoaded', async () => {
    const artistsContainer = document.getElementById('artists-container');
    const tracksContainer = document.getElementById('tracks-container');
    const searchInput = document.getElementById('search-input');
    const loading = document.getElementById('loading');
    const errorDisplay = document.getElementById('error');

    /**
     * Display error message
     * @param {string} message - Error message
     */
    const showError = (message) => {
        errorDisplay.textContent = message;
        errorDisplay.style.display = 'block';
        setTimeout(() => {
            errorDisplay.style.display = 'none';
        }, 5000);
    };

    /**
     * Render artists to DOM
     * @param {Array} artists - Array of artist objects
     */
    const renderArtists = (artists) => {
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
    };

    /**
     * Render tracks to DOM
     * @param {Array} tracks - Array of track objects
     */
    const renderTracks = (tracks) => {
        tracksContainer.innerHTML = tracks.map(track => `
            <div class="track">
                <div class="track-photo" 
                     style="background-image: url('${track.image[2]?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'}')">
                </div>
                <div class="track-info">
                    <h3>${track.name}</h3>
                    <p>${track.artist.name}</p>
                </div>
            </div>
        `).join('');
    };

    /**
     * Load initial data
     */
    const loadData = async () => {
        try {
            loading.style.display = 'block';
            const [artists, tracks] = await Promise.all([
                LastFM.getTopArtists(),
                LastFM.getTopTracks()
            ]);
            renderArtists(artists);
            renderTracks(tracks);
        } catch (error) {
            showError('Failed to load data. Please try again later.');
        } finally {
            loading.style.display = 'none';
        }
    };

    // Search functionality
    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
            try {
                loading.style.display = 'block';
                const results = await LastFM.search(searchInput.value.trim(), 'artist');
                renderArtists(results);
            } catch (error) {
                showError('Search failed. Please try again.');
            } finally {
                loading.style.display = 'none';
            }
        }
    });

    // Initial load
    loadData();
});