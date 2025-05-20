import React, { createContext, useContext, useRef, useState } from 'react';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

const AudioProviderV2 = ({ children }) => {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = (track) => {
    setCurrentTrack(track);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }, 0);
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, playTrack, pauseTrack, audioRef }}>
      {children}

      {/* ✅ The single shared <audio> element here */}
      <audio
        controls
        ref={audioRef}
        src={currentTrack?.src || ''}
        controls
        style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }}
      />
    </AudioContext.Provider>
  );
};
export default AudioProviderV2;
