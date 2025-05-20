// REFERENCE:
// soundcloud-redux-master/src/views/components/player/player.js

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { audio, playerActions, getPlayer, getPlayerTrack,
//   // getPlayerTracklistCursor
// } from 'core/player';
import { Track } from 'core/tracks';
import { createShallowEqualSelector } from 'core/utils/index';

import AudioCurrentTime from '../audio-current-time';
import AudioTimeline from '../audio-timeline';
import FormattedTime from '../formatted-time';
import FormattedVolume from '../formatted-volume';
import IconButton from '../icon-button';

import './player.css';


function Player({
  decreaseVolume,
  increaseVolume,

  isPlaying,
  nextTrack,
  pause,
  play,
  previousTrack,
  track,

  volume
}) {
  if (!track) return null;

  return (
    <div className="player">
      <div className="player-timeline">
        <AudioTimeline />
      </div>

      <div className="player-controls">
        <div>
          <IconButton
            icon="skip-previous"
            label="Skip to previous track"
            onClick={previousTrack}
          />

          <IconButton
            icon={isPlaying ? 'pause' : 'play'}
            label={isPlaying ? 'Pause' : 'Play'}
            onClick={isPlaying ? pause : play}
          />

          <IconButton
            icon="skip-next"
            label="Skip to next track"
            onClick={nextTrack}
          />
        </div>

        <div className="player-controls__time">
          <AudioCurrentTime /> / <FormattedTime value={track.duration_ms} unit={'ms'} />
        </div>

        <div className="player-controls__title">
          {track.title}
        </div>

        <div className="player-controls__volume">
          <IconButton
            icon="remove"
            label="Decrease volume"
            onClick={decreaseVolume}
          />

          <FormattedVolume value={volume} />

          <IconButton
            icon="add"
            label="Increase volume"
            onClick={increaseVolume}
          />
        </div>
      </div>
    </div>
  );
}

//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = createShallowEqualSelector(
  getPlayer,
  getPlayerTrack,
  // getPlayerTracklistCursor,
  (
    player,
    track,
    // cursor
  ) => ({
    decreaseVolume: audio.decreaseVolume,
    increaseVolume: audio.increaseVolume,
    isPlaying: player.isPlaying,
    // nextTrackId: cursor.nextTrackId,
    pause: audio.pause,
    play: audio.play,
    // previousTrackId: cursor.previousTrackId,
    track,
    tracklistId: player.tracklistId,
    volume: player.volume
  })
);

const mapDispatchToProps = {
  select: playerActions.playSelectedTrack
};

// const mergeProps = (stateProps, dispatchProps, ownProps) => {
//   const { nextTrackId, previousTrackId, tracklistId } = stateProps;
//   return Object.assign({}, ownProps, stateProps, {
//     nextTrack: nextTrackId ? dispatchProps.select.bind(null, nextTrackId, tracklistId) : null,
//     previousTrack: previousTrackId ? dispatchProps.select.bind(null, previousTrackId, tracklistId) : null
//   });
// };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  // mergeProps
)(Player);
