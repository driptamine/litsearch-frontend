// REFERENCE https://stackoverflow.com/questions/66329185/pause-other-video-if-selected-video-is-playing-in-react

import VideoPlayerProvider from './VideoPlayerProvider';
import Player from './Player';

function Page() {
  return (
    <VideoPlayerProvider>
      <Player video="/path/to/video1.mp4" id="player1" />
      <Player video="/path/to/video2.mp4" id="player2" />
      <Player video="/path/to/video3.mp4" id="player3" />
    </VideoPlayerProvider>
  )
}
