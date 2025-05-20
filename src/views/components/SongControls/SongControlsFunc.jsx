import React, { useState } from 'react';
import styled from "styled-components";
import moment from 'moment';

// MATERIAL DONE
// import { ListItem, ListItemText, ListItemAvatar, Avatar, makeStyles } from "@mui/material";
import { StyledListItem, StyledListItemText, StyledListItemAvatar, StyledAvatar } from 'views/styledComponents';

// VIEWS
import './SongControls.css';


const Container = styled.div`

`;
const SongDetails = styled.div`

`;
const SongArtwork = styled.div`

`;
const SongArtistName = styled.div`

`;
const SongName = styled.p`

`;
const ArtistName = styled.p`

`;
const SongControl = styled.div`

`;
const SongProgressContainer = styled.div`

`;

const SongControls = ({ songPaused, }) => {

  // state = {
  //   timeElapsed: this.props.timeElapsed
  // };

  const [timeElapsed, setTimeElapsed] = useState(null)

  // componentWillReceiveProps(nextProps) {
  //
  //   if (!nextProps.songPlaying) {
  //     clearInterval(this.state.intervalId);
  //   }
  //
  //   if (nextProps.songPlaying && nextProps.timeElapsed === 0) {
  //     clearInterval(this.state.intervalId);
  //     this.calculateTime();
  //   }
  //
  //   this.setState({
  //     timeElapsed: nextProps.timeElapsed
  //   });
  //
  // }

  const calculateTime = () => {

    const intervalId = setInterval(() => {
      if (this.state.timeElapsed === 30) {
        clearInterval(this.state.intervalId);
        this.props.stopSong();
      } else if (!this.props.songPaused) {
        this.props.increaseSongTime(this.state.timeElapsed + 1);
      }
    }, 1000);

    this.setState({
      intervalId: intervalId
    });

  }

  const getSongIndex = () => {
    const { songs, songDetails } = this.props;
    const currentIndex = songs.map((song, index) => {
      if (song.track === songDetails) {
        return index;
      } else {
        return undefined;
      }
    }).filter(item => {
      return item !== undefined;
    })[0];

    return currentIndex;
  }

  const nextSong = () => {
    const { songs, audioControl } = this.props;
    let currentIndex = this.getSongIndex();
    currentIndex === songs.length - 1 ? audioControl(songs[0]) : audioControl(songs[currentIndex + 1]);
  }

  const prevSong = () => {
    const { songs, audioControl } = this.props;
    let currentIndex = this.getSongIndex();
    currentIndex === 0 ? audioControl(songs[songs.length - 1]) : audioControl(songs[currentIndex - 1]);
  }


  const showPlay = this.props.songPaused ? 'fa fa-play-circle-o play-btn' : 'fa fa-pause-circle-o pause-btn';

  return (
    <Container className='song-player-container'>

      <SongDetails className='song-details'>
        <SongArtwork className='song-artwork'>
          <ListItemAvatar
            // style={{
            //
            // }}
          >
            <Avatar src={this.props.songArtwork? this.props.songArtwork: ""}  variant={"rounded"} />
          </ListItemAvatar>
        </SongArtwork>

        <SongArtistName className='song-artist-name'>
          <SongName className='song-name'>{this.props.songName}</SongName>
          <ArtistName className='artist-name'>{this.props.artistName}</ArtistName>
        </SongArtistName>
      </SongDetails>

      <SongControl className='song-controls'>

        <div onClick={this.prevSong} className='reverse-song'>
          <i className="fa fa-step-backward reverse" aria-hidden="true" />
        </div>

        <div className='play-btn'>
          <i onClick={!this.props.songPaused ? this.props.pauseSong : this.props.resumeSong} className={"fa play-btn" + showPlay} aria-hidden="true" />
        </div>

        <div onClick={this.nextSong} className='next-song'>
          <i className="fa fa-step-forward forward" aria-hidden="true" />
        </div>

      </SongControl>

      <SongProgressContainer className='song-progress-container'>
        <TimerStart className='timer-start'>{moment().minutes(0).second(this.state.timeElapsed).format('m:ss')}</TimerStart>
        <SongProgress className='song-progress'>
          <div style={{ width: this.state.timeElapsed * 16.5 }} className='song-expired' />
        </SongProgress>
        <TimerEnd className='timer-end'>{moment().minutes(0).second(30 - this.state.timeElapsed).format('m:ss')}</TimerEnd>
      </SongProgressContainer>

    </Container>
  );

}


export default SongControls;
