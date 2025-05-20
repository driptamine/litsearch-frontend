import { createAction } from "@reduxjs/toolkit";

export const fetchSearch = createAction(
  "search/fetch",
  query => ({
    payload: { query, page: DEFAULT_FIRST_PAGE }
  })
);

export const fetchMovieSearch = createAction(
  "movie/search",
  (query, page) => ({
    payload: { query, page }
  })
);

export const fetchTrackSearch = createAction(
  "track/search",
  (query, page, offset) => ({
    payload: { query, page, offset }
  })
);

export const fetchArtistSearch = createAction(
  "artist/search",
  (query, page, offset) => ({
    payload: { query, page, offset }
  })
);

export const fetchAlbumSearch = createAction(
  "album/search",
  (query, page, offset) => ({
    payload: { query, page, offset }
  })
);

export const fetchPlaylistSearch = createAction(
  "playlist/search",
  (query, page, offset) => ({
    payload: { query, page, offset }
  })
);

export const fetchPersonSearch = createAction(
  "person/search",
  (query, page) => ({
    payload: { query, page }
  })
);
