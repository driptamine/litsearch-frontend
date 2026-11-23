import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import useSyncedLocalState from 'core/hooks2/useSyncedLocalState';
// import { getLocalstorage } from '../../util';
import { playSong, stopSong, pauseSong, resumeSong, } from 'core/actions/index';

const MusicPlayerContext = React.createContext();

const MusicPlayerProvider = ({ children }) => {
  let audio;

  const dispatch = useDispatch()
  const stopTrack = () => dispatch(stopSong())
  const playTrack = (song) => dispatch(playSong(song))
  const pauseTrack = () => dispatch(pauseSong())
  const resumeTrack = () => dispatch(resumeSong())


  const stopSongz = () => {
    if (audio) {
      // this.props.stopSong();
      stopTrack();
      audio.pause();
      console.log("STOPE");
    }
  };

  const pauseSongz = () => {
    if (audio) {
      // this.props.pauseSong();
      pauseTrack();
      audio.pause();
      console.log("PAUSE");
    }
  };

  const resumeSongz = () => {
    if (audio) {
      // this.props.resumeSong();
      resumeTrack();
      audio.play();
      console.log("RESUME");
    }
  };

  const audioControlz = (song) => {
    // const { playSong, stopSong } = this.props;

    if (audio === undefined) {
      playTrack(song.track);
      audio = new Audio(song.track.preview_url);
      audio.play();
      console.log("PLAYA-undefined");
    } else {
      // stopSongz();
      stopSong();
      audio.pause();
      playTrack(song.track);
      console.log("PLAYA");
      audio = new Audio(song.track.preview_url);
      audio.play();
    }
  };


  return (
    <MusicPlayerContext.Provider
      value={{
        stopSongz,
        pauseSongz,
        resumeSongz,
        audioControlz
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export { MusicPlayerContext, MusicPlayerProvider };
// export default MusicPlayerProvider;
