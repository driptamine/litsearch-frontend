// REFERENCE: https://voskan.host/2023/03/26/how-to-create-a-custom-video-player-in-react-js/

import React, { useRef, useState, useEffect } from 'react';
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
import HLS from 'hls.js';

import './video-player.css';
import Slider from './slider/Slider';
import { StyledTypography } from 'views/styledComponents';



const CustomPlayerV4 = ({ url, light, viewsCount, likesCount }, props) => {
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

  const [aspectRatio, setAspectRatio] = useState('16:9');

  const handleLoadedMetadata = () => {
    const videoElement = videoRef.current;
    const { videoWidth, videoHeight } = videoElement;
    const ratio = (videoWidth / videoHeight).toFixed(2);

    if (ratio === '1.78') {
      setAspectRatio('16:9'); // 1920x1080
    } else if (ratio === '1.00') {
      setAspectRatio('1:1'); // 1080x1080
    } else {
      setAspectRatio(`${videoWidth}:${videoHeight}`);
    }
  };

  const format = (seconds) => {
    if (isNaN(seconds)) {
      return `00:00`;
    }
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const onChange = (e) => {
    const video = videoRef.current
    video.currentTime = (video.duration / 100) * e.target.value
    setPercentage(e.target.value)
  }

  const play = () => {
    const video = videoRef.current
    video.volume = 0.1

    if (!isPlaying) {
      setIsPlaying(true)
      video.play()
    }

    if (isPlaying) {
      setIsPlaying(false)
      video.pause()
    }
  }

  const handleSubtitles = () => {
    setShowSubtitles(!showSubtitles);
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

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement.readyState >= 1) {
      handleLoadedMetadata(); // If metadata is already loaded
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const videoUrl = url
    let hls;
    if (HLS.isSupported()) {
      hls = new HLS();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
    } else {

      video.src = videoUrl;
      video.type = 'video/mp4';
      // addSourceToVideo(video, videoSrcInMp4, 'video/mp4');
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
    <VideoContainer ref={videoContainerRef} aspectRatio={aspectRatio}>

      <OverlayPlayButtonV2
        onClick={handlePlayPause}


        onDoubleClick={handleFullScreen}
        >

      </OverlayPlayButtonV2>
      <VideoWrapper aspectRatio={aspectRatio}>
        <Video
          ref={videoRef}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}

          src={url}
          onTimeUpdate={getCurrDuration}
          onLoadedData={(e) => {
            setDuration(e.currentTarget.duration.toFixed(2))
          }}
          onLoadedMetadata={handleLoadedMetadata}
        >

        </Video>
      </VideoWrapper>

      <DisplayDiv>


        <div className="controls">

          <Slider
            className
            percentage={percentage}
            onChange={onChange}
            style={{
              position: 'absolute',
              bottom: '18px'
            }}
          />
          <PlayButton onClick={handlePlayPause}>{isPlaying ? <FaPause /> : <FaPlay />}</PlayButton>
          <Duration className="duration">
            {format((currentTime ), 'mm:ss')}
            {' / '}
            {format((duration ), 'mm:ss')}
          </Duration>

          <button>{volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}</button>
          {/*<input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />*/}
          <button onClick={handleFullScreen}>{isFullScreen ? <FaCompress /> : <FaExpand />}</button>
        </div>
      </DisplayDiv>
    </VideoContainer>
  );
};

const DisplayDiv = styled.div`
  display: flex;
`;
const Overlay = styled.div`
  position: absolute;
`;

const StyledSlider = styled(Slider)`
  position: absolute;
  bottom: 18px;
`;
const OverlayPlayButton = styled.div`

  position: absolute;
  z-index: 100;
  width: 403px;
  height: 176px;
  /* background: #0000002e; */
`;
const OverlayPlayButtonV2 = styled.div`

  width: 100%;
  height: 82%;
  background-color: transparent;

  position: absolute;
  z-index: 100;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;

  margin-top: 0px;
  margin-bottom: 1px;
  margin-right: auto;
  margin-left: auto;


`;
const PlayButton = styled.button`
  /* cursor: pointer; */
  margin-left: 10px;
`;
const Duration = styled.div`
  /* cursor: pointer; */
  color: white;
  font-family: sans-serif;
`;


const VideoContainer = styled.div`
  position: relative;

  /* margin: 0 auto; */

  /* display: grid; */

  /* max-width: 600px; */



  width: 100%;
  max-width: ${({ aspectRatio }) => (aspectRatio === '16:9' ? '1920px' : aspectRatio === '1:1' ? '600px' : '100%')};
  margin: 0 auto;

  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 8px;
  @media (max-width: 1920px) {
    max-width: 600px;
  }

  @media (max-width: 1080px) {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;
const VideoWrapper = styled.div`


  position: relative;
  width: 100%;
  /* padding-bottom: ${({ aspectRatio }) => (aspectRatio === '16:9' ? '56.25%' : aspectRatio === '1:1' ? '100%' : 'auto')};
  height: 0; */

  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  background: #000;
`;
const Video = styled.video`
  /* position: absolute; */
  width: 100%;
  height: 100%;

  margin-left: auto;
  margin-right: auto;
`;
export default CustomPlayerV4
