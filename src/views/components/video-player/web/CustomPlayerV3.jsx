// REFERENCE: https://voskan.host/2023/03/26/how-to-create-a-custom-video-player-in-react-js/

import React, { useRef, useState } from 'react';
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaClosedCaptioning,
  FaVolumeUp,
  FaVolumeMute,
} from 'react-icons/fa';
import { BsArrowRepeat } from 'react-icons/bs';
import styled from 'styled-components';

import './video-player.css';
import Slider from './slider/Slider';

const DisplayDiv = styled.div`
  display: flex;
`;

const StyledSlider = styled(Slider)`
  position: absolute;
  bottom: 18px;
`;

const CustomPlayerV3 = ({ url, light, viewsCount, likesCount }, props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSubtitles, setShowSubtitles] = useState(false);

  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);


  const [percentage, setPercentage] = useState(0)

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

  const handleSubtitles = () => {
    setShowSubtitles(!showSubtitles);
  };
  const handlePlaybackRateChange = (event) => {
    setPlaybackRate(event.target.value);
    videoRef.current.playbackRate = event.target.value;
  };
  const handleLoop = () => {
    setIsLooping(!isLooping);
    videoRef.current.loop = !isLooping;
  };
  const handleFullScreen = () => {
    if (!isFullScreen) {
      videoContainerRef.current.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };
  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
    videoRef.current.volume = event.target.value;
  };
  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const getCurrDuration = (e) => {
    const percent = ((e.currentTarget.currentTime / e.currentTarget.duration) * 100).toFixed(2)
    const time = e.currentTarget.currentTime

    setPercentage(+percent)
    setCurrentTime(time.toFixed(2))
  }

  return (
    <div className="video-player" ref={videoContainerRef}>
      <video
        ref={videoRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}

        src={url}
        onTimeUpdate={getCurrDuration}
        onLoadedData={(e) => {
          setDuration(e.currentTarget.duration.toFixed(2))
        }}
      >
        <source src={url} type="video/mp4" />
      </video>
      <DisplayDiv>


        <div className="controls">
          <button onClick={handlePlayPause}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
          <StyledSlider
            className
            percentage={percentage}
            onChange={onChange}
            style={{
              position: 'absolute',
              bottom: '18px'
            }}
          />



          <button onClick={handleSubtitles}>
            {showSubtitles ? <FaClosedCaptioning /> : <FaClosedCaptioning color="#999" />}
          </button>
          <button>{volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}</button>
          {/*<input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />*/}
          <button onClick={handleFullScreen}>{isFullScreen ? <FaCompress /> : <FaExpand />}</button>
        </div>
      </DisplayDiv>
    </div>
  );
};
export default CustomPlayerV3
