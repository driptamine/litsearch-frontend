// https://chatgpt.com/c/b4d1983d-b7ae-42b2-b2e1-362736185bda
import React, { useState, useEffect, useRef } from 'react';

const CLIENT_ID = 'your_spotify_client_id';
const REDIRECT_URI = 'http://localhost:3000/callback';
const SCOPES = ['user-read-private', 'user-read-email', 'playlist-read-private'];
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES.join('%20')}`;

// Fetch playlist tracks
const fetchSpotifyPlaylist = async (accessToken, playlistId) => {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data.items.map((item) => ({
    name: item.track.name,
    artist: item.track.artists[0].name,
    previewUrl: item.track.preview_url, // Use the preview URL
    id: item.track.id,
  }));
};


const SpotifyPlaylistPlayer = ({ accessToken, playlistId }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  // Fetch playlist tracks when the component loads
  useEffect(() => {
    const fetchData = async () => {
      const tracks = await fetchSpotifyPlaylist(accessToken, playlistId);
      setPlaylist(tracks);
    };

    if (accessToken && playlistId) {
      fetchData();
    }
  }, [accessToken, playlistId]);

  // Play next song when current one ends
  const handleTrackEnd = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0); // Loop back to the start
    }
  };

  // Automatically play the next track
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [currentTrackIndex]);

  return (
    <div>
      <h2>Now Playing: {playlist[currentTrackIndex]?.name} by {playlist[currentTrackIndex]?.artist}</h2>

      {/* Audio element */}
      <audio
        ref={audioRef}
        src={playlist[currentTrackIndex]?.previewUrl}
        controls
        autoPlay
        onEnded={handleTrackEnd}
      >
        Your browser does not support the audio element.
      </audio>

      {/* Next/Previous Controls */}
      <div>
        <button
          onClick={() => setCurrentTrackIndex(currentTrackIndex > 0 ? currentTrackIndex - 1 : playlist.length - 1)}
          disabled={currentTrackIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentTrackIndex((currentTrackIndex + 1) % playlist.length)}
        >
          Next
        </button>
      </div>

      {/* Playlist Display */}
      <h3>Playlist</h3>
      <ul>
        {playlist.map((track, index) => (
          <li
            key={track.id}
            style={{ fontWeight: currentTrackIndex === index ? 'bold' : 'normal' }}
          >
            {track.name} by {track.artist}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpotifyPlaylistPlayer;
