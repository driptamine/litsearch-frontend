// REFERENCE https://stackoverflow.com/questions/66329185/pause-other-video-if-selected-video-is-playing-in-react

import { PlayerContext } from './PlayerProvider';

function Player({ video, id }) {
  const { isPlaying, play, pause } = useContext(PlayerContext);

  <ReactPlayer
    ref={videoRef}
    playsinline={true}
    playing={isPlaying(id)}
    controls={true}
    url={video?.url}
    width="100%"
    height="100%"
    onPause={() => pause(id)}
    onEnded={() => pause(id)}
    onClickPreview={() => play(id)}
    playIcon={
      <div
        className="play-icon"
        role="button"
        tabIndex={0}
        style={{ outline: "none" }}
      >
        {" "}
        {/*<img src="/images/play.png" alt="" />*/}
      </div>
    }
    light={video?.pic}
  />;
}

export default Player;
