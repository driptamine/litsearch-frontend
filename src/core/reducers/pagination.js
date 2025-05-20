import { combineReducers } from "redux";
import createPagination, {
  selectors as paginationSelectors
} from "./higherOrderReducers/createPagination";
import createOffsetPagination, {
  selectors as offsetPaginationSelectors
} from "./higherOrderReducers/createOffsetPagination";
import * as actions from "core/actions";
import createByKey from "./higherOrderReducers/createByKey";

const pagination = combineReducers({
  popularMovies: createPagination(actions.fetchPopularMovies),
  popularPeople: createPagination(actions.fetchPopularPeople),
  popularArtists: createPagination(actions.fetchPopularArtists),
  popularAlbums: createPagination(actions.fetchPopularAlbums),
  popularTracks: createPagination(actions.fetchPopularTracks),
  playlistTracks: createOffsetPagination(actions.fetchPlaylistTracks),

  websiteSearchResultsByQuery: createByKey(
    action => action.payload?.query,
    createPagination([actions.fetchWebsiteSearch, actions.fetchSearch])
  ),
  querySearchResultsByQuery: createByKey(
    action => action.payload?.query,
    createPagination([actions.fetchQuerySearch, actions.fetchSearch])
  ),
  imageSearchResultsByQuery: createByKey(
    action => action.payload?.query,
    createPagination([actions.fetchImageSearch, actions.fetchSearch])
  ),

  movieSearchResultsByQuery: createByKey(
    action => action.payload?.query,
    createPagination([actions.fetchMovieSearch, actions.fetchSearch])
  ),
  personSearchResultsByQuery: createByKey(
    action => action.payload?.query,
    createPagination([actions.fetchPersonSearch, actions.fetchSearch])
  ),
  artistSearchResultsByQuery: createByKey(
    action => action.payload?.query,
    createOffsetPagination([actions.fetchArtistSearch, actions.fetchSearch])
  ),
  albumSearchResultsByQuery: createByKey(
    action => action.payload?.query,
    createOffsetPagination([actions.fetchAlbumSearch, actions.fetchSearch])
  ),
  trackSearchResultsByQuery: createByKey(
    action => action.payload?.query,
    createOffsetPagination([actions.fetchTrackSearch, actions.fetchSearch])
  ),

  // playlistTracksByPlaylistId: createByKey(
  //   action => action.payload?.playlistId,
  //   createOffsetPagination([actions.fetchPlaylistTracks, actions.fetchSearch])
  // ),
  playlistTracksByPlaylistId: createByKey(
    action => action.payload?.playlistId,
    createOffsetPagination([actions.fetchPlaylistTracks, actions.fetchSearch])
  )
});

export default pagination;

export const selectors = {
  // Popular Movies
  selectPopularMovieIds: state =>
    paginationSelectors.selectPageItems(state.popularMovies),
  selectPopularMoviesNextPage: state =>
    paginationSelectors.selectNextPage(state.popularMovies),

  // Popular Tracks
  selectTrackIds: state =>
    offsetPaginationSelectors.selectPageItems(state.playlistTracksByPlaylistId),
  selectTracksNextPage: state =>
    offsetPaginationSelectors.selectNextPage(state.playlistTracksByPlaylistId),


  // Popular Albums
  selectPopularAlbumIds: state =>
    paginationSelectors.selectPageItems(state.popularAlbums),
  selectPopularAlbumsNextPage: state =>
    paginationSelectors.selectNextPage(state.popularAlbums),


  // Popular Artists
  selectPopularArtistIds: state =>
    paginationSelectors.selectPageItems(state.popularArtists),
  selectPopularArtistsNextPage: state =>
    paginationSelectors.selectNextPage(state.popularArtists),

  // // Popular Tracks
  // selectPopularTrackIds: state =>
  //   paginationSelectors.selectPageItems(state.popularTracks),
  // selectPopularTracksNextPage: state =>
  //   paginationSelectors.selectNextPage(state.popularTracks),

  // Popular People
  selectPopularPeopleIds: state =>
    paginationSelectors.selectPageItems(state.popularPeople),
  selectPopularPeopleNextPage: state =>
    paginationSelectors.selectNextPage(state.popularPeople),

  // MovieSearchResultsByQuery
  selectMovieSearchResultIds: (state, query) =>
    paginationSelectors.selectPageItems(state.movieSearchResultsByQuery[query]),
  selectMovieSearchResultsNextPage: (state, query) =>
    paginationSelectors.selectNextPage(state.movieSearchResultsByQuery[query]),
  selectMovieSearchResultsTotalCount: (state, query) =>
    paginationSelectors.selectTotalCount(state.movieSearchResultsByQuery[query]),

  // ArtistSearchResultsByQuery
  selectArtistSearchResultIds: (state, query) =>
    paginationSelectors.selectPageItems(state.artistSearchResultsByQuery[query]),
  selectArtistSearchResultsNextPage: (state, query) =>
    offsetPaginationSelectors.selectNextPage(state.artistSearchResultsByQuery[query]),
  selectArtistSearchResultsTotalCount: (state, query) =>
    paginationSelectors.selectTotalCount(state.artistSearchResultsByQuery[query]),


  // ArtistSearchResultsByQuery
  selectAlbumSearchResultIds: (state, query) =>
    offsetPaginationSelectors.selectPageItems(state.albumSearchResultsByQuery[query]),
  selectAlbumSearchResultsNextPage: (state, query) =>
    offsetPaginationSelectors.selectNextPage(state.albumSearchResultsByQuery[query]),
  selectAlbumSearchResultsTotalCount: (state, query) =>
    paginationSelectors.selectTotalCount(state.albumSearchResultsByQuery[query]),

  // playlist tracks offset
  selectPlaylistTrackIds: (state, playlistId) =>
    offsetPaginationSelectors.selectPageItems(state.playlistTracksByPlaylistId[playlistId]),
  selectPlaylistTracksNextPage: (state, playlistId) =>
    offsetPaginationSelectors.selectNextPage(state.playlistTracksByPlaylistId[playlistId]),


  // TrackSearchResultsByQuery
  selectTrackSearchResultIds: (state, query) =>
    paginationSelectors.selectPageItems(state.trackSearchResultsByQuery[query]),
  selectTrackSearchResultsNextPage: (state, query) =>
    offsetPaginationSelectors.selectNextPage(state.trackSearchResultsByQuery[query]),
  selectTrackSearchResultsTotalCount: (state, query) =>
    paginationSelectors.selectTotalCount(state.trackSearchResultsByQuery[query]),

  // PersonSearchResultsByQuery
  selectPersonSearchResultIds: (state, query) =>
    paginationSelectors.selectPageItems(state.personSearchResultsByQuery[query]),
  selectPersonSearchResultsNextPage: (state, query) =>
    paginationSelectors.selectNextPage(state.personSearchResultsByQuery[query]),
  selectPersonSearchResultsTotalCount: (state, query) =>
    paginationSelectors.selectTotalCount(state.personSearchResultsByQuery[query]),

  // WebSearchResultsByQuery
  selectWebsiteSearchResultIds: (state, query) =>
    paginationSelectors.selectPageItems(state.websiteSearchResultsByQuery[query]),
  selectWebsiteSearchResultsNextPage: (state, query) =>
    paginationSelectors.selectNextPage(state.websiteSearchResultsByQuery[query]),
  selectWebsiteSearchResultsTotalCount: (state, query) =>
    paginationSelectors.selectTotalCount(state.websiteSearchResultsByQuery[query]),

  // QuerySearchResultsByQuery
  selectQuerySearchResultIds: (state, query) =>
    paginationSelectors.selectPageItems(state.querySearchResultsByQuery[query]),
  selectQuerySearchResultsNextPage: (state, query) =>
    paginationSelectors.selectNextPage(state.querySearchResultsByQuery[query]),
  selectQuerySearchResultsTotalCount: (state, query) =>
    paginationSelectors.selectTotalCount(state.querySearchResultsByQuery[query]),

  // ImageSearchResultsByQuery
  selectImageSearchResultIds: (state, query) =>
    paginationSelectors.selectPageItems(state.imageSearchResultsByQuery[query]),
  selectImageSearchResultsNextPage: (state, query) =>
    paginationSelectors.selectNextPage(state.imageSearchResultsByQuery[query]),
  selectImageSearchResultsTotalCount: (state, query) =>
    paginationSelectors.selectTotalCount(state.imageSearchResultsByQuery[query]),
};

//














//
