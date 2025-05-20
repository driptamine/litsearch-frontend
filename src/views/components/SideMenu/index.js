import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import SideMenu from "./component";

import { fetchSongs, fetchRecentlyPlayed, updateViewType } from '../actions-pau1fitz/songActions';
import { fetchAlbums } from '../actions-pau1fitz/albumActions';
import { fetchArtists } from '../actions-pau1fitz/artistActions';
import { fetchFeatured } from '../actions-pau1fitz/browseActions';
import { updateHeaderTitle } from '../actions-pau1fitz/uiActions';

const mapStateToProps = (state) => {

  return {
    // userId: state.userReducer.user ? state.userReducer.user.id : '',
    // token: state.tokenReducer.token ? state.tokenReducer.token : '',
    // artistIds: state.artistsReducer.artistIds,
    // title: state.uiReducer.title
  };

};

const mapDispatchToProps = (dispatch) => {

  return bindActionCreators({
    fetchRecentlyPlayed,
    fetchSongs,
    fetchAlbums,
    fetchArtists,
    fetchFeatured,
    updateViewType,
    updateHeaderTitle,
  }, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
