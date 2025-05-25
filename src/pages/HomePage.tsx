import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const popularTracks = [
    { title: "Good Luck, Babe!", artist: "Chappell Roan" },
    { title: "No One Noticed", artist: "The Marias" },
    { title: "Abracadabra", artist: "Lady Gaga" },
    { title: "guess (feat. Billie Eilish)", artist: "Charli XCX" },
    { title: "BIRDS OF A FEATHER", artist: "Billie Eilish" },
    { title: "Party 4 U", artist: "Charli XCX" },
    { title: "luther (with SZA)", artist: "Kendrick Lamar" },
    { title: "Von Dutch", artist: "Charli XCX" },
    { title: "What Was That", artist: "Lorde" },
    { title: "See You Again (feat. Kali Uchis)", artist: "Tyler, the Creator" },
    { title: "espresso", artist: "Sabrina Carpenter" },
    { title: "Die With A Smile", artist: "Lady Gaga" }
  ];

  const hotArtists = [
    "Kendrick Lamar", "Lady Gaga", "The Weeknd", "Tyler, the Creator",
    "Billie Eilish", "Charli XCX", "Radiohead", "Rihanna",
    "Kanye West", "Lana Del Rey", "Drake", "Ariana Grande"
  ];

  return (
    <div className="lastfm-container">
      {/* Шапка */}
      <header className="lastfm-header">
        <div className="header-left">
          <Link to="/" className="logo">last.fm</Link>
          <nav className="main-nav">
            <Link to="/">Home</Link>
            <Link to="/live">Live</Link>
            <Link to="/music">Music</Link>
            <Link to="/charts">Charts</Link>
            <Link to="/events">Events</Link>
            <Link to="/features">Features</Link>
          </nav>
        </div>
        <div className="search-box">
          <input type="text" placeholder="Search" />
        </div>
      </header>

      {/* Основной контент */}
      <main className="content">
        <div className="left-sidebar">
          <h2>Music</h2>
          <div className="hot-artists">
            <h3>Hot right now</h3>
            <ul>
              {hotArtists.map((artist, index) => (
                <li key={index}>
                  <Link to={`/artist/${artist.toLowerCase().replace(/\s+/g, '-')}`}>
                    {artist}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="main-content">
          <h1>Popular tracks</h1>
          <div className="tracks-list">
            {popularTracks.map((track, index) => (
              <div key={index} className="track">
                <span className="track-number">{index + 1}</span>
                <div className="track-info">
                  <Link to={`/track/${track.title.toLowerCase().replace(/\s+/g, '-')}`} className="track-title">
                    {track.title}
                  </Link>
                  <Link to={`/artist/${track.artist.toLowerCase().replace(/\s+/g, '-')}`} className="track-artist">
                    {track.artist}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;