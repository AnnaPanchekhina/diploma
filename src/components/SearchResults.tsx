import React from 'react';

interface SearchResultsProps {
  artist: any;
  albums: any[];
  tracks: any[];
  onBack: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ artist, albums, tracks, onBack }) => {
  return (
    <section className="search-results">
      <div className="artist-profile">
        {artist && (
          <>
            <div 
              className="artist-profile-photo" 
              style={{ backgroundImage: `url('${artist.image[3]?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'}'` }}
            />
            <div className="artist-profile-info">
              <h1>{artist.name}</h1>
            </div>
          </>
        )}
      </div>
      
      <div className="artist-albums">
        <h2>Albums</h2>
        <div className="albums-grid">
          {albums?.map((album, index) => (
            <div className="album" key={index}>
              <div 
                className="album-cover" 
                style={{ backgroundImage: `url('${album.image[2]?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'}'` }}
              />
              <div className="album-info">
                <h3>{album.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="artist-tracks">
        <h2>Top Tracks</h2>
        <div className="track-list">
          {tracks?.map((track, index) => (
            <div className="track" key={index}>
              <span className="track-number">{index + 1}</span>
              <div 
                className="track-photo" 
                style={{ backgroundImage: `url('${track.image[2]?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'}'` }}
              />
              <div className="track-info">
                <h3>{track.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchResults;