import { useState, useRef } from 'react'
import Hls from "hls.js";

import song from './Suncrown - Legend of the Forgotten Centuries.mp3'
import Slider from './slider/Slider'
import AudioSlider from './slider/AudioSlider'
import ControlPanel from './controls/ControlPanel'

function AudioPlayer({ url, light, viewsCount, likesCount }, props) {
  const [percentage, setPercentage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const audioRef = useRef()

  const onChange = (e) => {
    const audio = audioRef.current
    audio.currentTime = (audio.duration / 100) * e.target.value
    setPercentage(e.target.value)
  }

  const play = () => {
    const audio = audioRef.current
    audio.volume = 0.8

    if (!isPlaying) {
      setIsPlaying(true)
      audio.play()
    }

    if (isPlaying) {
      setIsPlaying(false)
      audio.pause()
    }
  }

  const getCurrDuration = (e) => {
    const percent = ((e.currentTarget.currentTime / e.currentTarget.duration) * 100).toFixed(2)
    const time = e.currentTarget.currentTime

    setPercentage(+percent)
    setCurrentTime(time.toFixed(2))
  }

  return (
    <div
      className='audio-player'
      style={{
        width: '300px',

      }}
      >


      <audio
        ref={audioRef}
        onTimeUpdate={getCurrDuration}
        onLoadedData={(e) => {
          setDuration(e.currentTarget.duration.toFixed(2))
        }}
        src={url}
        style={{
          width: `100%`
        }}
      ></audio>
      <div
        style={{
          width: '100%',

        }}
      >
      <AudioSlider
        percentage={percentage}
        onChange={onChange}

        />
      </div>
      <ControlPanel
        play={play}
        isPlaying={isPlaying}
        duration={duration}
        currentTime={currentTime}
        audioRef={audioRef}
      />

    </div>
  )
}

export default AudioPlayer
