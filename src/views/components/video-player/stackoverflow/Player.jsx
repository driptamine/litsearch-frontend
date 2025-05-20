// REFERENCE https://stackoverflow.com/questions/62516611/how-to-add-custom-styles-to-the-controls-provided-by-react-player

import { useState, useRef } from "react"
import ReactPlayer from "react-player"
import { IoPlay, IoPause } from "react-icons/io5"

const Player = () => {
  const [playing, setPlaying] = useState(true)
  const [durationSeconds, setDurationSeconds] = useState(0)
  const [playedSeconds, setPlayedSeconds] = useState(0)
  const playerRef = useRef()
  return (
    <div>
      <ReactPlayer
        ref={playerRef}
        controls={false}
        playing={playing}
        url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        onProgress={({ playedSeconds }) => setPlayedSeconds(playedSeconds)}
        onSeek={setPlayedSeconds}
        // This is called when the player has the duration
        onDuration={setDurationSeconds}
      />
      <Controls
        playerRef={playerRef}
        playing={playing}
        setPlaying={setPlaying}
        playedSeconds={playedSeconds}
        duration={durationSeconds}
      />
    </div>
  )
}

const Controls = props => {
  const seek = e => {
    props.playerRef.current.seekTo(+e.target.value, "seconds")
  }

  return (
    <div>
      <button onClick={() => props.setPlaying(!props.playing)}>
        {props.playing ? <IoPause /> : <IoPlay />}
      </button>
      <input
        type="range"
        value={props.playedSeconds}
        min="0"
        max={props.duration}
        onChange={seek}
      />
    </div>
  )
}

export default Player
