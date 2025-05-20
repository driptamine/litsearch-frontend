const stopSongz = () => {
  if (audio) {
    // this.props.stopSong();
    stopSong();
    audio.pause();
    console.log("STOPE");
  }
};

const pauseSongz = () => {
  if (audio) {
    // this.props.pauseSong();
    pauseSongzz();
    audio.pause();
    console.log("PAUSE");
  }
};

const resumeSongz = () => {
  if (audio) {
    // this.props.resumeSong();
    resumeSong();
    audio.play();
    console.log("RESUME");
  }
};

const audioControlz = (song) => {
  // const { playSong, stopSong } = this.props;

  if (audio === undefined) {
    playSongzz(song.track);
    audio = new Audio(song.track.preview_url);
    audio.play();
    console.log("PLAYA-undefined");
  } else {
    // stopSongz();
    stopSong();
    audio.pause();
    playSongzz(song.track);
    console.log("PLAYA");
    audio = new Audio(song.track.preview_url);
    audio.play();
  }
};


export { stopSongz, pauseSongz, resumeSongz, audioControlz };
