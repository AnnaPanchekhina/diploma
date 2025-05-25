import React from 'react';

const ArtistCard = ({ artist }: { artist: any }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    <img 
      src={artist.image[2]?.['#text'] || 'https://via.placeholder.com/300'} 
      alt={artist.name}
      style={{
        width: '100%',
        borderRadius: '50%',
        marginBottom: '10px'
      }}
    />
    <h3 style={{ margin: '5px 0' }}>{artist.name}</h3>
    <p style={{ color: '#666', margin: 0 }}>
      {parseInt(artist.listeners).toLocaleString()} слушателей
    </p>
  </div>
);

export default ArtistCard;