import { createSlice } from '@reduxjs/toolkit';
import union from 'lodash/union';
import * as actions from 'core/actions';

export const DEFAULT_FIRST_PAGE = 1;
export const DEFAULT_FIRST_OFFSET = 0;

const initialPaginationState = {
  nextPage: DEFAULT_FIRST_PAGE,
  pageCount: 0,
  totalCount: 0,
  ids: []
};

const initialOffsetPaginationState = {
  nextPage: DEFAULT_FIRST_OFFSET,
  pageCount: 0,
  totalCount: 0,
  ids: []
};

const storePage = (state, action) => {
  const { response } = action.payload || {};
  if (!response) return;
  const { result } = response;
  const { results, total_pages, total_results } = result || {};

  state.ids = union(state.ids, results || []);
  state.pageCount = state.pageCount + 1;
  state.totalCount = total_results || 0;
  state.nextPage = (total_pages && state.nextPage < total_pages) ? state.nextPage + 1 : null;
};

const storeOffsetPage = (state, action) => {
  const { response } = action.payload || {};
  if (!response) return;
  const { result } = response;
  const { results, total_results } = result || {};

  state.ids = union(state.ids, results || []);
  state.pageCount = state.pageCount + 1;
  state.totalCount = total_results || 0;
  state.nextPage = (total_results && state.nextPage < total_results) ? state.nextPage + 50 : null;
};

const initialState = {
  popularMovies: initialPaginationState,
  popularPeople: initialPaginationState,
  popularArtists: initialPaginationState,
  popularAlbums: initialPaginationState,
  popularTracks: initialPaginationState,
  playlistTracks: initialOffsetPaginationState,
  websiteSearchResultsByQuery: {},
  querySearchResultsByQuery: {},
  imageSearchResultsByQuery: {},
  movieSearchResultsByQuery: {},
  personSearchResultsByQuery: {},
  artistSearchResultsByQuery: {},
  albumSearchResultsByQuery: {},
  trackSearchResultsByQuery: {},
  playlistTracksByPlaylistId: {},
  feedPosts: initialPaginationState,
};

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const actionHandlers = {};

    const registerHandler = (actionCreator, stateKey, isOffset, isByKey, getByKey) => {
      const type = `${actionCreator}/succeeded`;
      if (!actionHandlers[type]) actionHandlers[type] = [];
      
      actionHandlers[type].push((state, action) => {
        if (isByKey) {
          const key = getByKey(action);
          if (key) {
            if (!state[stateKey][key]) {
              state[stateKey][key] = isOffset ? { ...initialOffsetPaginationState } : { ...initialPaginationState };
            }
            if (isOffset) storeOffsetPage(state[stateKey][key], action);
            else storePage(state[stateKey][key], action);
          }
        } else {
          if (isOffset) storeOffsetPage(state[stateKey], action);
          else storePage(state[stateKey], action);
        }
      });
    };

    const handlePagination = (actionCreator, stateKey, isOffset = false, isByKey = false, getByKey = null) => {
      const acList = Array.isArray(actionCreator) ? actionCreator : [actionCreator];
      acList.forEach(ac => registerHandler(ac, stateKey, isOffset, isByKey, getByKey));
    };

    handlePagination(actions.fetchPopularMovies, 'popularMovies');
    handlePagination(actions.fetchPopularPosts, 'feedPosts');
    handlePagination(actions.fetchPopularPeople, 'popularPeople');
    handlePagination(actions.fetchPopularArtists, 'popularArtists');
    handlePagination(actions.fetchPopularAlbums, 'popularAlbums');
    handlePagination(actions.fetchPopularTracks, 'popularTracks');
    handlePagination(actions.fetchPlaylistTracks, 'playlistTracks', true);

    handlePagination([actions.fetchWebsiteSearch, actions.fetchSearch], 'websiteSearchResultsByQuery', false, true, action => action.payload?.query);
    handlePagination([actions.fetchQuerySearch, actions.fetchSearch], 'querySearchResultsByQuery', false, true, action => action.payload?.query);
    handlePagination([actions.fetchImageSearch, actions.fetchSearch, actions.fetchBraveImageSearch, actions.fetchBingImageSearch], 'imageSearchResultsByQuery', false, true, action => `${action.payload?.searchType || 'images'}_${action.payload?.query}`);
    handlePagination([actions.fetchMovieSearch, actions.fetchSearch], 'movieSearchResultsByQuery', false, true, action => action.payload?.query);
    handlePagination([actions.fetchPersonSearch, actions.fetchSearch], 'personSearchResultsByQuery', false, true, action => action.payload?.query);
    
    handlePagination([actions.fetchArtistSearch, actions.fetchSearch], 'artistSearchResultsByQuery', true, true, action => action.payload?.query);
    handlePagination([actions.fetchAlbumSearch, actions.fetchSearch], 'albumSearchResultsByQuery', true, true, action => action.payload?.query);
    handlePagination([actions.fetchTrackSearch, actions.fetchSearch], 'trackSearchResultsByQuery', true, true, action => action.payload?.query);
    
    handlePagination([actions.fetchPlaylistTracks, actions.fetchSearch], 'playlistTracksByPlaylistId', true, true, action => action.payload?.playlistId);

    // Apply all registered handlers
    Object.keys(actionHandlers).forEach(type => {
      builder.addCase(type, (state, action) => {
        actionHandlers[type].forEach(handler => handler(state, action));
      });
    });

    builder.addCase('POST/DELETE/SUCCEEDED', (state, action) => {
      const { postId } = action.payload;
      state.feedPosts.ids = state.feedPosts.ids.filter(id => id !== postId);
    });
  }
});

export default paginationSlice.reducer;

export const selectors = {
  selectNextPage: (state = {}) => state.nextPage,
  selectPageCount: (state = {}) => state.pageCount,
  selectTotalCount: (state = {}) => state.totalCount,
  selectPageItems: (state = {}) => state.ids,

  selectPopularMovieIds: state => selectors.selectPageItems(state.popularMovies),
  selectPopularMoviesNextPage: state => selectors.selectNextPage(state.popularMovies),

  selectFeedPostIds: state => selectors.selectPageItems(state.feedPosts),
  selectFeedPostsNextPage: state => selectors.selectNextPage(state.feedPosts),

  selectTrackIds: state => selectors.selectPageItems(state.playlistTracksByPlaylistId),
  selectTracksNextPage: state => selectors.selectNextPage(state.playlistTracksByPlaylistId),

  selectPopularAlbumIds: state => selectors.selectPageItems(state.popularAlbums),
  selectPopularAlbumsNextPage: state => selectors.selectNextPage(state.popularAlbums),

  selectPopularArtistIds: state => selectors.selectPageItems(state.popularArtists),
  selectPopularArtistsNextPage: state => selectors.selectNextPage(state.popularArtists),

  selectPopularPeopleIds: state => selectors.selectPageItems(state.popularPeople),
  selectPopularPeopleNextPage: state => selectors.selectNextPage(state.popularPeople),

  selectMovieSearchResultIds: (state, query) => selectors.selectPageItems(state.movieSearchResultsByQuery[query]),
  selectMovieSearchResultsNextPage: (state, query) => selectors.selectNextPage(state.movieSearchResultsByQuery[query]),
  selectMovieSearchResultsTotalCount: (state, query) => selectors.selectTotalCount(state.movieSearchResultsByQuery[query]),

  selectArtistSearchResultIds: (state, query) => selectors.selectPageItems(state.artistSearchResultsByQuery[query]),
  selectArtistSearchResultsNextPage: (state, query) => selectors.selectNextPage(state.artistSearchResultsByQuery[query]),
  selectArtistSearchResultsTotalCount: (state, query) => selectors.selectTotalCount(state.artistSearchResultsByQuery[query]),

  selectAlbumSearchResultIds: (state, query) => selectors.selectPageItems(state.albumSearchResultsByQuery[query]),
  selectAlbumSearchResultsNextPage: (state, query) => selectors.selectNextPage(state.albumSearchResultsByQuery[query]),
  selectAlbumSearchResultsTotalCount: (state, query) => selectors.selectTotalCount(state.albumSearchResultsByQuery[query]),

  selectPlaylistTrackIds: (state, playlistId) => selectors.selectPageItems(state.playlistTracksByPlaylistId[playlistId]),
  selectPlaylistTracksNextPage: (state, playlistId) => selectors.selectNextPage(state.playlistTracksByPlaylistId[playlistId]),

  selectTrackSearchResultIds: (state, query) => selectors.selectPageItems(state.trackSearchResultsByQuery[query]),
  selectTrackSearchResultsNextPage: (state, query) => selectors.selectNextPage(state.trackSearchResultsByQuery[query]),
  selectTrackSearchResultsTotalCount: (state, query) => selectors.selectTotalCount(state.trackSearchResultsByQuery[query]),

  selectPersonSearchResultIds: (state, query) => selectors.selectPageItems(state.personSearchResultsByQuery[query]),
  selectPersonSearchResultsNextPage: (state, query) => selectors.selectNextPage(state.personSearchResultsByQuery[query]),
  selectPersonSearchResultsTotalCount: (state, query) => selectors.selectTotalCount(state.personSearchResultsByQuery[query]),

  selectWebsiteSearchResultIds: (state, query) => selectors.selectPageItems(state.websiteSearchResultsByQuery[query]),
  selectWebsiteSearchResultsNextPage: (state, query) => selectors.selectNextPage(state.websiteSearchResultsByQuery[query]),
  selectWebsiteSearchResultsTotalCount: (state, query) => selectors.selectTotalCount(state.websiteSearchResultsByQuery[query]),

  selectQuerySearchResultIds: (state, query) => selectors.selectPageItems(state.querySearchResultsByQuery[query]),
  selectQuerySearchResultsNextPage: (state, query) => selectors.selectNextPage(state.querySearchResultsByQuery[query]),
  selectQuerySearchResultsTotalCount: (state, query) => selectors.selectTotalCount(state.querySearchResultsByQuery[query]),

  selectImageSearchResultIds: (state, query, searchType = 'images') => selectors.selectPageItems(state.imageSearchResultsByQuery[`${searchType}_${query}`]),
  selectImageSearchResultsNextPage: (state, query, searchType = 'images') => selectors.selectNextPage(state.imageSearchResultsByQuery[`${searchType}_${query}`]),
  selectImageSearchResultsTotalCount: (state, query, searchType = 'images') => selectors.selectTotalCount(state.imageSearchResultsByQuery[`${searchType}_${query}`]),
};
