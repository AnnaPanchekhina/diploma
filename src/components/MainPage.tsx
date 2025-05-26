import React from 'react';

interface MainPageProps {
  artists: any[];
  tracks: any[];
}

const MainPage: React.FC<MainPageProps> = ({ artists, tracks }) => {
  return (
    <section className="main-page">
      <section className="music-section">
        <h1>Music</h1>
        <div className="hot-artists">
          <h2>Hot right now</h2>
          <div className="artist-grid">
            {artists.map((artist, index) => (
              <div className="artist" key={index}>
                <div 
                  className="artist-photo" 
                  style={{ backgroundImage: `url('${artist.image[2]?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'}'` }}
                />
                <div className="artist-info">
                  <h3>{artist.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="popular-tracks">
        <h2>Popular tracks</h2>
        <div className="track-list">
          {tracks.map((track, index) => (
            <div className="track" key={index}>
              <div 
                className="track-photo" 
                style={{ backgroundImage: `url('${track.image[2]?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'}'` }}
              />
              <div className="track-info">
                <h3>{track.name}</h3>
                <p>{track.artist?.name || 'Unknown Artist'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default MainPage;