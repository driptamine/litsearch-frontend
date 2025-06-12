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


const RecommendedVideo = ({ url, light, viewsCount, likesCount }, props) => {
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

  // useEffect(() => {
  //   const video = videoRef.current;
  //   const videoUrl = url
  //   let hls;
  //   if (HLS.isSupported()) {
  //     hls = new HLS();
  //     hls.loadSource(videoUrl);
  //     hls.attachMedia(video);
  //   } else {
  //
  //     video.src = videoUrl;
  //     video.type = 'video/mp4';
  //     // addSourceToVideo(video, videoSrcInMp4, 'video/mp4');
  //     video.play();
  //   }
  //
  //   function addSourceToVideo(element, src, type) {
  //     var source = document.createElement('source');
  //     source.src = src;
  //     source.type = type;
  //     element.appendChild(source);
  //   }
  //   return () => hls && hls.destroy();
  // }, [url]);

  return (
    <div className="video-player" ref={videoContainerRef}>

      <OverlayPlayButtonV2 onClick={handlePlayPause}>

      </OverlayPlayButtonV2>

      <Video
        ref={videoRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}

        src={url}
        onTimeUpdate={getCurrDuration}
        onLoadedData={(e) => {
          setDuration(e.currentTarget.duration.toFixed(2))
        }}
        // controls
      >

      </Video>
      <DisplayDiv>



      </DisplayDiv>
    </div>
  );
};

const Video = styled.video`
  width: 100%;
  height: 100%;

  margin-left: auto;
  margin-right: auto;
`;


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
  height: 75%;
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

export default RecommendedVideo
