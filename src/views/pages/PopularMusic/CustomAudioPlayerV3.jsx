import React from 'react';
import styled from 'styled-components';
import { useAudio } from './AudioContext'; // adjust path
import { FaPlay } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa';

const CustomAudioPlayerV3 = ({ src, title, artistName }) => {
  const audioRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const { playAudio, stopAudio } = useAudio();

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
      stopAudio();
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
    <div>
      <HiddenAudio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Top row: PlayButton + Song Title */}
      <PlayerRow>
        <PlayButton onClick={togglePlay}>
          {isPlaying ? <FaPause/> : <FaPlay/>}
        </PlayButton>
        <SongTitle>{title}</SongTitle>
        <SongArtist>{artistName}</SongArtist>

      </PlayerRow>

      {/* ProgressBar under title */}
      {isPlaying && (
        <ProgressWrapper>
          <ProgressBar
            type="range"
            value={progress}
            onChange={handleProgressChange}
          />
        </ProgressWrapper>
      )}
    </div>
  );
};

const HiddenAudio = styled.audio`
  display: none;
`;

const PlayerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PlayButton = styled.button`
  background-color: black;
  border: none;
  color: white;
  padding: 8px 10px;
  border-radius: 50%;
  cursor: pointer;
  font-family: Verdana;
  font-size: 16px;
  width: 40px;
  height: 40px;
  transition: background-color 0.3s;

  &:hover {
    background-color: gray;
  }
`;

const SongTitle = styled.h3`
  color: ${props => props.theme.text};
  font-family: Verdana;
  font-size: 16px;
  margin: 0;
`;
const SongArtist = styled.h3`
  color: grey;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  font-family: Verdana;
`;

const ProgressWrapper = styled.div`
  margin-top: 6px;
`;

const ProgressBar = styled.input`
  cursor: pointer;
  width: 100%;
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

export default CustomAudioPlayerV3;
