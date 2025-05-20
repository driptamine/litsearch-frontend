import React from 'react';
import styled from 'styled-components';
import { useAudio } from './AudioContext'; // adjust the path if needed
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

const CustomAudioPlayer = ({ src, title }) => {
  const audioRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const { playAudio } = useAudio();

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      playAudio(audio, () => {
        setIsPlaying(false);
        setProgress(0);
      });
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const percentage = (audio.currentTime / audio.duration) * 100;
    setProgress(percentage || 0);
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    const newTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = newTime;
  };

  return (
    <Wrapper>
      <HiddenAudio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
      />
      <PlayButton onClick={togglePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </PlayButton>

      {isPlaying && (
        <ProgressBar
          type="range"
          value={progress}
          onChange={handleProgressChange}
        />
      )}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: block;
`;
const HiddenAudio = styled.audio`
  display: none;
`;


const PlayButton = styled.button`
  background-color: black;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-family: Verdana;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: gray;
  }
`;

const ProgressBar = styled.input`
  /* position: absolute; */
  cursor: pointer;
  width: 300px;
  margin-top: 8px;
  appearance: none;
  height: 5px;
  background: #555;
  border-radius: 5px;
  opacity: 0.8;
  transition: opacity 0.3s ease;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 10px;
    height: 10px;
    background: gray;
    border-radius: 50%;
    cursor: pointer;
  }
`;

export default CustomAudioPlayer;
