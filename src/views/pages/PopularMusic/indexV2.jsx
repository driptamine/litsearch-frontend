// indexV2.jsx or TrackList.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import tracks from './music.json'; // Make sure this has { tracks: [...] }
import { Link } from 'react-router-dom';
import { FiPlay } from 'react-icons/fi';
import { FiPause } from 'react-icons/fi';
import { FaPlay } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa';
import { IoMusicalNote } from "react-icons/io5";

// import AudioProviderV2 from 'views/pages/PopularMusic/AudioContextV2'
import AudioProviderV3 from 'views/pages/PopularMusic/AudioContextV3'
// import { useAudio } from 'views/pages/PopularMusic/AudioContextV2';
import { useAudio } from 'views/pages/PopularMusic/AudioContextV3';

const TrackList = () => {
  return (
    <AudioProviderV3>
      <TrackListContent />
    </AudioProviderV3>
  );
};

const TrackListContent = () => {
  const {
    playTrack,
    pauseTrack,
    currentTrack,
    togglePlayPause,
    isPlaying,
    isSeeking,
    setIsSeeking,
    progress,
    seek

  } = useAudio();

  const [localProgress, setLocalProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const timeoutRef = useRef(null);


  const handleSeek = (e) => {
    const percent = parseFloat(e.target.value);

    // Debounce logic: clear old timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      seek(percent);
    }, 50); // debounce delay in ms
  };

  return (
    <ListContainer>
      {tracks.tracks.map((track, index) => (
        <TrackRow
          key={index}
          // onClick={(e) => {
          //   e.stopPropagation();
          //   togglePlayPause({
          //     src: track.url,
          //     title: track.title,
          //     artistName: track.artists[0].name
          //   });
          //
          // }}
        >

          <TrackNumber>{index + 1}</TrackNumber>

          <PlayPauseButton
            onClick={(e) => {

              e.stopPropagation();
              togglePlayPause({
                src: track.url,
                title: track.title,
                artistName: track.artists[0].name
              });

            }}
          >
          {currentTrack?.src === track.url
            ? isPlaying
              ? <PauseButton />
              : <PlayButton />
            : <IoMusicalNote />}

          </PlayPauseButton>
          <New isPlaying={currentTrack?.src === track.url}>
            <TrackInfo isPlaying={currentTrack?.src === track.url}>
              <TrackTitle>{track.title}</TrackTitle>
              {(currentTrack?.src === track.url) && (
                <span className="divider">&nbsp;</span>
              )}

              <TrackArtist>{track.artists[0].name}</TrackArtist>
            </TrackInfo>

            <ProgressArea>
            {currentTrack?.src === track.url && (
              <ProgressWrapper>
                <ProgressBar
                  type="range"
                  value={progress}

                  progress={progress}



                  onMouseDown={() => {
                    setIsSeeking(true)
                  }}
                  onTouchStart={() => {
                    setIsSeeking(true)
                  }}

                  // onChange={(e) => {
                  //   const value = parseFloat(e.target.value);
                  //   setLocalProgress(value); // update temporary UI
                  // }}

                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setIsSeeking(true);
                    seek(value);
                  }}

                  onMouseUp={(e) => {

                    setIsSeeking(false);
                  }}
                  onTouchEnd={(e) => {
                    // const value = parseFloat(e.target.value);
                    // seek(value);
                    setIsSeeking(false);
                  }}
                />
              </ProgressWrapper>
            )}
            </ProgressArea>
          </New>
        </TrackRow>
      ))}
      {currentTrack && (
        <NowPlaying>
          🎧 Now Playing: {currentTrack.title} — {currentTrack.artistName}
        </NowPlaying>
      )}
    </ListContainer>
  );
};





const ThemedWrapper = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;

  // Inherit theme-aware color
  color: var(--icon-color, #000);

  @media (prefers-color-scheme: dark) {
    --icon-color: #fff;
  }
`;




// Styled component for the circular button
const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  /* height: 100px; */
  /* background-color: #3498db; */
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;

  /* &:hover {
    background-color: #2980b9;
  } */

  margin: 10px; // Spacing between buttons


  // Inherit theme-aware color
  color: var(--icon-color, #000);

  @media (prefers-color-scheme: dark) {
    --icon-color: #fff;
  }

`;

const Icon = styled.svg`
  width: 28px;  // Adjusted size of the icon
  height: 28px; // Adjusted size of the icon
  fill: inherit;
`;


const PlayButton = () => (
  <ButtonWrapper>
    <Icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g>
        <circle cx="12" cy="12" r="10"  />
        {/* A visually rounded play icon */}
        <path
          d="M10 8.5C10 8, 10.5 8, 11 8.3L15 11C15.5 11.3, 15.5 12.7, 15 13L11 15.7C10.5 16, 10 16, 10 15.5V8.5Z"
          fill="currentColor"
        />

      </g>
    </Icon>
  </ButtonWrapper>
);



const PauseButton = () => (
  <ButtonWrapper>
    <Icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g>
        <circle cx="12" cy="12" r="10" fill="#fff" />
        {/* Rounded pause bars using <rect> with rx/ry */}
        <rect x="9" y="8" width="2" height="8" rx="1" ry="1" fill="black" />
        <rect x="13" y="8" width="2" height="8" rx="1" ry="1" fill="black" />
      </g>
    </Icon>
  </ButtonWrapper>
);






const New = styled.div`
  display: flex;
  flex-direction: ${props => (props.isPlaying ? 'column' : 'row')};
`
const PlayPauseButton = styled.div`
  user-select: none;

  width: 40px;
  height: 40px;
  margin-right: 10px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  /* background-color: #686cb9; */
  background-color: #3d3d3d;
  border-radius: 5px;
  cursor: pointer;
`;

const ProgressArea = styled.div`
  position: relative;
  height: 20px;
`;
const ProgressWrapper = styled.div`
  width: 100%;
  /* padding: 12px; */
`;

// const ProgressBar = styled.input.attrs({ type: 'range' })`
//   cursor: pointer;
//   width: 400px;
//   height: 5px;
//   /* background: #444; */
//   background: linear-gradient(
//     90deg,
//     #5865f2 0%,
//     #8e5cf7 100%
//   );
//   appearance: none;
//   border-radius: 4px;
//
//   &::-webkit-slider-thumb {
//     appearance: none;
//     width: 12px;
//     height: 12px;
//     background: #686cb9;
//     border-radius: 50%;
//     cursor: pointer;
//   }
// `;

const ProgressBar = styled.input.attrs({ type: 'range' })`
  width: 400px;
  height: 6px;
  appearance: none;
  border-radius: 5px;
  background: ${({ progress }) => `
    linear-gradient(
      to right,
      #686cb9 0%,
      #686cb9 ${progress}%,
      #333 ${progress}%,
      #333 100%
    )
  `};
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    height: 14px;
    width: 14px;
    background: white;
    border: 2px solid #5865f2;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(88, 101, 242, 0.7);
    margin-top: -4px;
    transition: background 0.3s;
  }

  &::-moz-range-thumb {
    height: 14px;
    width: 14px;
    background: white;
    border: 2px solid #5865f2;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(88, 101, 242, 0.7);
    transition: background 0.3s;
  }

  &::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 5px;
    background: transparent;
  }

  &::-moz-range-track {
    height: 6px;
    background: transparent;
    border-radius: 5px;
  }
`;



const ListContainer = styled.div`
  padding: 20px;
  /* background-color: #121212; */
  background-color: #222222;
  border-radius: 5px;
`;

const TrackRow = styled.div`

  display: flex;
  align-items: center;
  padding: 10px;

  border-bottom: 1px solid #333;
  &:hover {
    background-color: #1e1e1e;
  }
`;

const TrackNumber = styled.span`
  font-family: Verdana;
  color: #888;
  width: 30px;
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: ${props => (props.isPlaying ? 'row' : 'column')};
`;

const TrackTitle = styled.span`
  font-family: Verdana;
  font-size: 16px;
  color: white;
`;

const TrackArtist = styled.span`
  font-family: Verdana;

  font-size: ${props => (props.isPlaying ? '14px' : '16px')};
  color: gray;
`;

const NowPlaying = styled.div`
  display: none;
  // position: relative;
  bottom: 50px;
  width: 100%;
  background: #000;
  color: white;
  text-align: center;
  padding: 20px;
  font-family: Verdana;
`;

export default TrackList;
