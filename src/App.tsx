import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MainPage from './components/MainPage';
import SearchResults from './components/SearchResults';
import Footer from './components/Footer';
import Loading from './components/Loading';
import ErrorDisplay from './components/ErrorDisplay';

const API_KEY = '6409a29c7a720dd6499bbd419ef91ce2';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

function App() {
  const [view, setView] = useState<'main' | 'search'>('main');
  const [artists, setArtists] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [artistInfo, setArtistInfo] = useState<any>(null);
  const [artistAlbums, setArtistAlbums] = useState<any[]>([]);
  const [artistTracks, setArtistTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTop = useCallback(async (type: string) => {
    const params = new URLSearchParams();
    params.append('method', `chart.gettop${type}s`);
    params.append('api_key', API_KEY);
    params.append('format', 'json');
    params.append('limit', '8');

    const response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();
    return data[`${type}s`]?.[`${type}`] || [];
  }, []);

  const getArtistInfo = useCallback(async (artistName: string) => {
    const params = new URLSearchParams();
    params.append('method', 'artist.getInfo');
    params.append('artist', artistName);
    params.append('api_key', API_KEY);
    params.append('format', 'json');

    const response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();
    return data?.artist;
  }, []);

  const getArtistAlbums = useCallback(async (artistName: string) => {
    const params = new URLSearchParams();
    params.append('method', 'artist.getTopAlbums');
    params.append('artist', artistName);
    params.append('api_key', API_KEY);
    params.append('format', 'json');
    params.append('limit', '8');

    const response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();
    return data?.topalbums?.album;
  }, []);

  const getArtistTopTracks = useCallback(async (artistName: string) => {
    const params = new URLSearchParams();
    params.append('method', 'artist.getTopTracks');
    params.append('artist', artistName);
    params.append('api_key', API_KEY);
    params.append('format', 'json');
    params.append('limit', '10');

    const response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();
    return data?.toptracks?.track;
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [topArtists, topTracks] = await Promise.all([
        fetchTop('artist'),
        fetchTop('track')
      ]);
      setArtists(topArtists);
      setTracks(topTracks);
    } catch (err) {
      setError('Failed to load initial data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fetchTop]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setError('Please enter search term');
      return;
    }

    try {
      setLoading(true);
      setView('search');

      const artist = await getArtistInfo(query);
      if (artist) {
        setArtistInfo(artist);
        
        const [albums, topTracks] = await Promise.all([
          getArtistAlbums(artist.name),
          getArtistTopTracks(artist.name)
        ]);
        setArtistAlbums(albums);
        setArtistTracks(topTracks);
      }
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    setView('main');
  };

  return (
    <div className="app">
      <Header onSearch={handleSearch} />
      <main className="main-content">
        {loading && <Loading />}
        {error && <ErrorDisplay message={error} onClose={() => setError('')} />}
        
        {view === 'main' ? (
          <MainPage artists={artists} tracks={tracks} />
        ) : (
          <SearchResults 
            artist={artistInfo} 
            albums={artistAlbums} 
            tracks={artistTracks} 
            onBack={handleBackToHome}
          />
        )}
      </main>
      <Footer onBackToHome={handleBackToHome} />
    </div>
  );
}

export default App;