// import SongControls from "./SongControls";
import SongControlsStyled from "./SongControlsStyled";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { increaseSongTime } from "core/actions";

// const mapStateToProps = state => {
//   return {
//     songName: state.entities.playerTracks.songDetails ? state.entities.playerTracks.songDetails.name : "",
//     artistName: state.entities.playerTracks.songDetails ? state.entities.playerTracks.songDetails.artists[0].name : "",
//     songPlaying: state.entities.playerTracks.songPlaying,
//     timeElapsed: state.entities.playerTracks.timeElapsed,
//     songPaused: state.entities.playerTracks.songPaused,
//     songDetails: state.entities.playerTracks.songDetails,
//     songs: state.entities.playerTracks.songs
//   };
// };
// const { songName, } = useSelector((state) => state.entities.playlistTracks )
const mapStateToProps = state => {
  return {
    songName: state.entities.playlistTracks.songDetails ? state.entities.playlistTracks.songDetails.name : "",
    artistName: state.entities.playlistTracks.songDetails ? state.entities.playlistTracks.songDetails.artists[0].name : "",
    songArtwork: state.entities.playlistTracks.songDetails ? state.entities.playlistTracks.songDetails.album.images[2].url : "",
    songPlaying: state.entities.playlistTracks.songPlaying,
    timeElapsed: state.entities.playlistTracks.timeElapsed,
    songPaused: state.entities.playlistTracks.songPaused,
    songDetails: state.entities.playlistTracks.songDetails,
    songs: state.entities.playlistTracks.songs
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      increaseSongTime
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SongControlsStyled);

// export default connect(mapStateToProps, mapDispatchToProps)(SongControls);
