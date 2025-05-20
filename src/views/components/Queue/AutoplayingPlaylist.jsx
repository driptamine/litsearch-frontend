import React, { useState, useRef, useEffect } from "react";

const AutoplayingPlaylist = () => {
  // State for playlist, current song index, and whether a song is playing
  const [playlist, setPlaylist] = useState([
    { title: "Song 1", url: "/audio/song1.mp3" },
    { title: "Song 2", url: "/audio/song2.mp3" },
    { title: "Song 3", url: "/audio/song3.mp3" },
  ]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Ref for audio element
  const audioRef = useRef(null);

  // Effect to autoplay the next song when the current one ends
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleSongEnd);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleSongEnd);
      }
    };
  }, [currentSongIndex]);

  // Play the current song
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSongIndex]);

  // Handle when a song ends
  const handleSongEnd = () => {
    playNextSong();
  };

  // Play or pause the current song
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Skip to the next song in the queue
  const playNextSong = () => {
    if (currentSongIndex < playlist.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setIsPlaying(false); // Stop playing if it's the last song
    }
  };

  // Skip to the previous song
  const playPreviousSong = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  return (
    <div>
      <h2>Now Playing: {playlist[currentSongIndex].title}</h2>

      {/* Audio element */}
      <audio
        ref={audioRef}
        src={playlist[currentSongIndex].url}
        controls={false}
      />

      {/* Play/Pause button */}
      <button onClick={togglePlayPause}>
        {isPlaying ? "Pause" : "Play"}
      </button>

      {/* Skip buttons */}
      <button onClick={playPreviousSong} disabled={currentSongIndex === 0}>
        Previous
      </button>
      <button
        onClick={playNextSong}
        disabled={currentSongIndex === playlist.length - 1}
      >
        Next
      </button>

      <h3>Playlist Queue</h3>
      <ul>
        {playlist.map((song, index) => (
          <li
            key={index}
            style={{
              fontWeight: currentSongIndex === index ? "bold" : "normal",
            }}
          >
            {song.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutoplayingPlaylist;
