import React from 'react';

interface Track {
  name: string;
  artist: {
    name: string;
  };
  playcount?: string;
}

const TrackItem: React.FC<{ track: Track; index: number }> = ({ track, index }) => (
  <div className="track">
    <span className="track-number">{index + 1}</span>
    <div className="track-info">
      <span className="track-name">{track.name}</span>
      <span className="track-artist">{track.artist.name}</span>
    </div>
    {track.playcount && (
      <span className="track-plays">
        {parseInt(track.playcount).toLocaleString()} прослушиваний
      </span>
    )}
  </div>
);

export default TrackItem;