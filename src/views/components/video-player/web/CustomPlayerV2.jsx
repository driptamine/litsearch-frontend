


import { useEffect, useState, useRef } from 'react'
// import Hls from "hls.js";
import styled from 'styled-components';
import HLS from 'hls.js';


import song from './Suncrown - Legend of the Forgotten Centuries.mp3'
import Slider from './slider/Slider'
import ControlPanel from './controls/ControlPanel'

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Video = styled.video`
  min-width: 100%;
  min-height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

function CustomPlayerV2({ url, light, viewsCount, likesCount }, props) {
  const [percentage, setPercentage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const audioRef = useRef()
  const wrapperRef = useRef(null);

  const onChange = (e) => {
    const audio = audioRef.current
    audio.currentTime = (audio.duration / 100) * e.target.value
    setPercentage(e.target.value)
  }

  const play = () => {
    const audio = audioRef.current
    audio.volume = 0.1

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

  const videoRef = useRef();

  useEffect(() => {
    const video = videoRef.current;
    let hls;
    if (HLS.isSupported()) {
      hls = new HLS();
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url;
      addSourceToVideo(video, videoSrcInMp4, 'video/mp4');
      video.play();
    }

    function addSourceToVideo(element, src, type) {
      var source = document.createElement('source');
      source.src = src;
      source.type = type;
      element.appendChild(source);
    }
    return () => hls && hls.destroy();
  }, [url]);


  return (
    <div className='app-container' ref={wrapperRef}>
      <video
        key="video"
        ref={videoRef}
        innerRef={videoRef}

        autoPlay loop muted playsinline
        controls

        onTimeUpdate={getCurrDuration}
        onLoadedData={(e) => {
          setDuration(e.currentTarget.duration.toFixed(2))
        }}
        src={url}
        style={{
          width: `100%`
        }}
      />

      <Slider percentage={percentage} onChange={onChange} />
      <ControlPanel
        play={play}
        isPlaying={isPlaying}
        duration={duration}
        currentTime={currentTime}
        wrapperRef={wrapperRef}
      />
    </div>
  )
}

export default CustomPlayerV2
