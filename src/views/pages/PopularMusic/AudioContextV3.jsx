// views/pages/PopularMusic/AudioContext.js

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

const AudioContext = createContext();
export const useAudio = () => useContext(AudioContext);

const AudioProviderV3 = ({ children }) => {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100

  const [isSeeking, setIsSeeking] = useState(false);

  // Update progress as audio plays
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(percent);
    }
  };

  // Seek to a new time in audio
  const seek = (percent) => {
    const audio = audioRef.current;
    setIsSeeking(true);
    // if (audio && audio.duration) {
      audio.currentTime = (percent / 100) * audio.duration;
      setProgress(percent);
    // }
  };



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

  const togglePlayPause = (track) => {
    const audio = audioRef.current;

    // If the track is the current one
    if (currentTrack?.src === track.src) {
      if (audio.paused) {
        audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      setCurrentTrack(track);
      setTimeout(() => {
        if (audio) {
          audio.play().catch(console.error);
          setIsPlaying(true);
        }
      }, 0);
    }
  };

  // useEffect(() => {
  //   const stopSeeking = () => setIsSeeking(false);
  //   window.addEventListener('mouseup', stopSeeking);
  //   window.addEventListener('touchend', stopSeeking);
  //   return () => {
  //     window.removeEventListener('mouseup', stopSeeking);
  //     window.removeEventListener('touchend', stopSeeking);
  //   };
  // }, []);

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      playTrack,
      pauseTrack,

      togglePlayPause,

      audioRef,
      progress,
      seek,
      isSeeking,
      setIsSeeking
    }}>
      {children}

      <audio
        ref={audioRef}
        src={currentTrack?.src || ''}

        onTimeUpdate={handleTimeUpdate}
        style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }}
      />
    </AudioContext.Provider>
  );
};
export default AudioProviderV3;
