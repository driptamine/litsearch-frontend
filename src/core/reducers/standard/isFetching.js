import { createSlice } from '@reduxjs/toolkit';
import * as actions from 'core/actions';

const initialState = {
  websitesById: {},
  moviesById: {},
  postsById: {},
  artistsById: {},
  albumsById: {},
  playlistsById: {},
  tracksById: {},
  peopleById: {},
  movieVideosByMovieId: {},
  movieCreditsByMovieId: {},
  movieRecommendationsByMovieId: {},
  artistAlbumsByArtistId: {},
  movieImagesByMovieId: {},
  personImagesByPersonId: {},
  artistImagesByPersonId: {},
  personCreditsByPersonId: {},
  popularMovies: false,
  popularPeople: false,
  popularAlbums: false,
  search: false,
  websiteSearchResults: false,
  imageSearchResults: false,
  movieSearchResults: false,
  personSearchResults: false,
  artistSearchResults: false,
  albumSearchResults: false,
  trackSearchResults: false,
  playlistTracksByPlaylistId: {},
  playlistTracksById: false,
  token: false,
};

const isFetchingSlice = createSlice({
  name: 'isFetching',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const actionHandlers = {};

    const registerHandler = (actionCreator, stateKey, isMap, getMapKey, status) => {
      const type = `${actionCreator}/${status}`;
      if (!actionHandlers[type]) actionHandlers[type] = [];
      
      actionHandlers[type].push((state, action) => {
        const value = status === 'requested';
        if (isMap) {
          const key = getMapKey ? getMapKey(action) : action.payload?.id;
          if (key) state[stateKey][key] = value;
        } else {
          state[stateKey] = value;
        }
      });
    };

    const handleLoading = (actionCreator, stateKey, isMap = false, getMapKey = null) => {
      const acList = Array.isArray(actionCreator) ? actionCreator : [actionCreator];
      acList.forEach(ac => {
        registerHandler(ac, stateKey, isMap, getMapKey, 'requested');
        registerHandler(ac, stateKey, isMap, getMapKey, 'succeeded');
        registerHandler(ac, stateKey, isMap, getMapKey, 'failed');
        registerHandler(ac, stateKey, isMap, getMapKey, 'cancelled');
      });
    };

    // Define all cases
    handleLoading(actions.fetchWebsite, 'websitesById', true, action => action.payload?.websiteId);
    handleLoading(actions.fetchMovie, 'moviesById', true, action => action.payload?.movieId);
    handleLoading(actions.fetchPost, 'postsById', true, action => action.payload?.postId);
    handleLoading(actions.fetchArtist, 'artistsById', true, action => action.payload?.artistId);
    handleLoading(actions.fetchAlbum, 'albumsById', true, action => action.payload?.albumId);
    handleLoading(actions.fetchPlaylist, 'playlistsById', true, action => action.payload?.playlistId);
    handleLoading(actions.fetchTrack, 'tracksById', true, action => action.payload?.trackId);
    handleLoading(actions.fetchPerson, 'peopleById', true, action => action.payload?.personId);
    
    handleLoading(actions.fetchMovieVideos, 'movieVideosByMovieId', true, action => action.payload?.movieId);
    handleLoading(actions.fetchMovieCredits, 'movieCreditsByMovieId', true, action => action.payload?.movieId);
    handleLoading(actions.fetchRecommendations, 'movieRecommendationsByMovieId', true, action => action.payload?.movieId);
    handleLoading(actions.fetchArtistAlbums, 'artistAlbumsByArtistId', true, action => action.payload?.artistId);
    handleLoading(actions.fetchMovieImages, 'movieImagesByMovieId', true, action => action.payload?.movieId);
    handleLoading(actions.fetchPersonImages, 'personImagesByPersonId', true, action => action.payload?.personId);
    handleLoading(actions.fetchArtistImages, 'artistImagesByPersonId', true, action => action.payload?.artistId);
    handleLoading(actions.fetchPersonCredits, 'personCreditsByPersonId', true, action => action.payload?.personId);

    handleLoading(actions.fetchPopularMovies, 'popularMovies');
    handleLoading(actions.fetchPopularPeople, 'popularPeople');
    handleLoading(actions.fetchPopularAlbums, 'popularAlbums');
    handleLoading(actions.fetchSearch, 'search');

    handleLoading(actions.fetchWebsiteSearch, 'websiteSearchResults');
    handleLoading(actions.fetchMovieSearch, 'movieSearchResults');
    handleLoading(actions.fetchPersonSearch, 'personSearchResults');
    handleLoading(actions.fetchArtistSearch, 'artistSearchResults');
    handleLoading(actions.fetchAlbumSearch, 'albumSearchResults');
    handleLoading(actions.fetchTrackSearch, 'trackSearchResults');

    handleLoading(actions.fetchPlaylistTracks, 'playlistTracksByPlaylistId', true, action => action.payload?.playlistId);
    handleLoading(actions.fetchPlaylistTracks, 'playlistTracksById');

    // Image search handles multiple actions
    const imageSearchActions = [actions.fetchImageSearch, actions.fetchBingImageSearch, actions.fetchBraveImageSearch];
    imageSearchActions.forEach(ac => {
      registerHandler(ac, 'imageSearchResults', false, null, 'requested');
      registerHandler(ac, 'imageSearchResults', false, null, 'succeeded');
      registerHandler(ac, 'imageSearchResults', false, null, 'failed');
      registerHandler(ac, 'imageSearchResults', false, null, 'cancelled');
    });

    // Apply all registered handlers
    Object.keys(actionHandlers).forEach(type => {
      builder.addCase(type, (state, action) => {
        actionHandlers[type].forEach(handler => handler(state, action));
      });
    });
  },
});

export default isFetchingSlice.reducer;

export const selectors = {
  selectIsFetchingWebsite: (state, websiteId) => state.websitesById[websiteId],
  selectIsFetchingMovie: (state, movieId) => state.moviesById[movieId],
  selectIsFetchingPost: (state, postId) => state.postsById[postId],
  selectIsFetchingPerson: (state, personId) => state.peopleById[personId],
  selectIsFetchingArtist: (state, artistId) => state.artistsById[artistId],
  selectIsFetchingAlbum: (state, albumId) => state.albumsById[albumId],
  selectIsFetchingPlaylist: (state, playlistId) => state.playlistsById[playlistId],
  selectIsFetchingTrack: (state, trackId) => state.tracksById[trackId],
  selectIsFetchingPopularMovies: state => state.popularMovies,
  selectIsFetchingPopularPeople: state => state.popularPeople,
  selectIsFetchingPopularAlbums: state => state.popularAlbums,
  selectIsFetchingMovieCredits: (state, movieId) => state.movieCreditsByMovieId[movieId],
  selectIsFetchingMovieVideos: (state, movieId) => state.movieVideosByMovieId[movieId],
  selectIsFetchingMovieRecommendations: (state, movieId) => state.movieRecommendationsByMovieId[movieId],
  selectIsFetchingArtistAlbums: (state, artistId) => state.artistAlbumsByArtistId[artistId],
  selectIsFetchingMovieImages: (state, movieId) => state.movieImagesByMovieId[movieId],
  selectIsFetchingPersonImages: (state, personId) => state.personImagesByPersonId[personId],
  selectIsFetchingPersonCredits: (state, personId) => state.personCreditsByPersonId[personId],
  selectIsFetchingSearch: state => state.search,
  selectIsFetchingToken: state => state.token,
  selectIsFetchingWebsiteSearchResults: state => state.websiteSearchResults,
  selectIsFetchingImageSearchResults: state => state.imageSearchResults,
  selectIsFetchingMovieSearchResults: state => state.movieSearchResults,
  selectIsFetchingPersonSearchResults: state => state.personSearchResults,
  selectIsFetchingArtistSearchResults: state => state.artistSearchResults,
  selectIsFetchingAlbumSearchResults: state => state.albumSearchResults,
  selectIsFetchingTrackSearchResults: state => state.trackSearchResults,
  selectIsFetchingPlaylistTracks: (state, playlistId) => state.playlistTracksByPlaylistId[playlistId],
};
