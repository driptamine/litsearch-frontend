import { ReactPlayerProps } from 'react-player';

export interface VideoPlayerState {
  playing: boolean;
  controls: boolean;
  volume: number;
  light: boolean;
  progress: {
    playedSeconds: number;
  };
  duration: number;
}

export type VideoPlayerAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'DURATION'; payload: number }
  | { type: 'SEEK'; payload: number }
  | { type: 'VOLUME'; payload: number }
  | { type: 'LIGHT'; payload: boolean };

export const INITIAL_STATE: VideoPlayerState = {
  playing: false,
  controls: false,
  volume: 0.8,
  light: true,
  progress: {
    playedSeconds: 0,
  },
  duration: 0,
};

export const reducer = (state: VideoPlayerState, action: VideoPlayerAction): VideoPlayerState => {
  switch (action.type) {
    case 'PLAY':
      return { ...state, playing: true };
    case 'PAUSE':
      return { ...state, playing: false };
    case 'TOGGLE_PLAY':
      return { ...state, playing: !state.playing };
    case 'DURATION':
      return { ...state, duration: action.payload };
    case 'SEEK':
      return { ...state, progress: { playedSeconds: action.payload } };
    case 'VOLUME':
      return { ...state, volume: action.payload };
    case 'LIGHT':
      return { ...state, light: action.payload };
    default:
      return state;
  }
};