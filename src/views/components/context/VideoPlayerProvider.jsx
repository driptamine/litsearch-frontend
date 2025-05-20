// REFERENCE https://stackoverflow.com/questions/66329185/pause-other-video-if-selected-video-is-playing-in-react

export const PlayerContext = React.createContext({
  play: (playerId) => true,
  pause: (playerId) => true,
  isPlaying: (playerId) => false,
});

function VideoPlayerProvider({ children }) {
  // store the id of the current playing player
  const [playing, setPlaying] = useState('');

  // set playing to the given id
  const play = playerId => setPlaying(playerId);

  // unset the playing player
  const pause = () => setPlaying(false);

  // returns true if the given playerId is playing
  const isPlaying = playerId => playerId === playing;

  return (
    <PlayerContext.Provider value={{ play, pause, isPlaying }}>
      {children}
    </PlayerContext.Provider>
  )
}

export default VideoPlayerProvider;
