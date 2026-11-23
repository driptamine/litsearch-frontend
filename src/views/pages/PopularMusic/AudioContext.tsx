import React, { createContext, useState, useContext } from 'react';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

const AudioProvider = ({ children }) => {
  const [currentAudio, setCurrentAudio] = useState(null);
  const [stopCurrentPlaying, setStopCurrentPlaying] = useState(null);

  const playAudio = (audio, stopPlaying) => {
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      if (stopCurrentPlaying) {
        stopCurrentPlaying();
      }
    }
    setCurrentAudio(audio);
    setStopCurrentPlaying(() => stopPlaying);
  };

  return (
    <AudioContext.Provider value={{ playAudio }}>
      {children}
    </AudioContext.Provider>
  );
};
export default AudioProvider;
