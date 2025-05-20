import { combineReducers } from "redux";
import * as actions from "core/actions";
import createIsFetching from "./higherOrderReducers/createIsFetching";
import createByKey from "./higherOrderReducers/createByKey";

const isFetching = combineReducers({
  // genres: createIsFetching(actions.fetchGenres),

  websitesById: createByKey(
    action => action.payload?.websiteId,
    createIsFetching(actions.fetchWebsite)
  ),

  moviesById: createByKey(
    action => action.payload?.movieId,
    createIsFetching(actions.fetchMovie)
  ),
  artistsById: createByKey(
    action => action.payload?.artistId,
    createIsFetching(actions.fetchArtist)
  ),
  albumsById: createByKey(
    action => action.payload?.albumId,
    createIsFetching(actions.fetchAlbum)
  ),
  playlistsById: createByKey(
    action => action.payload?.playlistId,
    createIsFetching(actions.fetchPlaylist)
  ),
  tracksById: createByKey(
    action => action.payload?.trackId,
    createIsFetching(actions.fetchTrack)
  ),
  peopleById: createByKey(
    action => action.payload?.personId,
    createIsFetching(actions.fetchPerson)
  ),
  movieVideosByMovieId: createByKey(
    action => action.payload?.movieId,
    createIsFetching(actions.fetchMovieVideos)
  ),

  movieCreditsByMovieId: createByKey(
    action => action.payload?.movieId,
    createIsFetching(actions.fetchMovieCredits)
  ),
  movieRecommendationsByMovieId: createByKey(
    action => action.payload?.movieId,
    createIsFetching(actions.fetchRecommendations)
  ),
  artistAlbumsByArtistId: createByKey(
    action => action.payload?.artistId,
    createIsFetching(actions.fetchArtistAlbums)
  ),
  movieImagesByMovieId: createByKey(
    action => action.payload?.movieId,
    createIsFetching(actions.fetchMovieImages)
  ),
  personImagesByPersonId: createByKey(
    action => action.payload?.personId,
    createIsFetching(actions.fetchPersonImages)
  ),
  artistImagesByPersonId: createByKey(
    action => action.payload?.artistId,
    createIsFetching(actions.fetchArtistImages)
  ),
  personCreditsByPersonId: createByKey(
    action => action.payload?.personId,
    createIsFetching(actions.fetchPersonCredits)
  ),
  popularMovies: createIsFetching(actions.fetchPopularMovies),
  popularPeople: createIsFetching(actions.fetchPopularPeople),

  popularAlbums: createIsFetching(actions.fetchPopularAlbums),

  search: createIsFetching(actions.fetchSearch),


  websiteSearchResults: createIsFetching(actions.fetchWebsiteSearch),
  movieSearchResults: createIsFetching(actions.fetchMovieSearch),
  personSearchResults: createIsFetching(actions.fetchPersonSearch),
  artistSearchResults: createIsFetching(actions.fetchArtistSearch),
  albumSearchResults: createIsFetching(actions.fetchAlbumSearch),
  trackSearchResults: createIsFetching(actions.fetchTrackSearch),

  playlistTracksByPlaylistId: createByKey(
    action => action.payload?.playlistId,
    createIsFetching(actions.fetchPlaylistTracks)
  ),

  playlistTracksById: createIsFetching(actions.fetchPlaylistTracks),
});

export default isFetching;

export const selectors = {
  // selectIsFetchingGenres: state => state.genres,
  selectIsFetchingWebsite: (state, websiteId) => state.websitesById[websiteId],
  selectIsFetchingMovie: (state, movieId) => state.moviesById[movieId],
  selectIsFetchingPerson: (state, personId) => state.peopleById[personId],
  selectIsFetchingArtist: (state, artistId) => state.artistsById[artistId],
  selectIsFetchingAlbum: (state, albumId) => state.albumsById[albumId],

  selectIsFetchingPlaylist: (state, playlistId) => state.playlistsById[playlistId],

  selectIsFetchingTrack: (state, trackId) => state.tracksById[trackId],

  selectIsFetchingPopularMovies: state => state.popularMovies,

  selectIsFetchingPopularMagazines: state => state.popularMagazines,

  selectIsFetchingPopularPeople: state => state.popularPeople,

  selectIsFetchingPopularAlbums: state => state.popularAlbums,

  selectIsFetchingMovieCredits: (state, movieId) =>
    state.movieCreditsByMovieId[movieId],
  selectIsFetchingMovieVideos: (state, movieId) =>
    state.movieVideosByMovieId[movieId],



  selectIsFetchingMovieRecommendations: (state, movieId) =>
    state.movieRecommendationsByMovieId[movieId],

  selectIsFetchingArtistAlbums: (state, artistId) =>
    state.artistAlbumsByArtistId[artistId],

  selectIsFetchingMovieImages: (state, movieId) =>
    state.movieImagesByMovieId[movieId],
  selectIsFetchingPersonImages: (state, personId) =>
    state.personImagesByPersonId[personId],
  selectIsFetchingPersonCredits: (state, personId) =>
    state.personCreditsByPersonId[personId],

  selectIsFetchingSearch: state => state.search,

  selectIsFetchingToken: state => state.token,

  selectIsFetchingWebsiteSearchResults: state => state.websiteSearchResults,
  selectIsFetchingImageSearchResults: state => state.imageSearchResults,

  selectIsFetchingMovieSearchResults: state => state.movieSearchResults,
  selectIsFetchingPersonSearchResults: state => state.personSearchResults,
  selectIsFetchingArtistSearchResults: state => state.artistSearchResults,
  selectIsFetchingAlbumSearchResults: state => state.albumSearchResults,
  selectIsFetchingTrackSearchResults: state => state.trackSearchResults,

  selectIsFetchingPlaylistTracks: (state, playlistId) =>
    state.playlistTracksByPlaylistId[playlistId],

  // selectIsFetchingPlaylistTracks: (state, playlistId) =>
  //   state.playlistTracksById[playlistId],
};
