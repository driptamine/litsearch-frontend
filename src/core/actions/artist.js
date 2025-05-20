import { createAction } from "@reduxjs/toolkit";

export const fetchArtist = createAction(
  "artist/fetch",
  (artistId, requiredFields) => ({
    payload: { artistId, requiredFields }
  })
);

export const fetchArtistImages = createAction(
  "artist/fetchImages",
  artistId => ({
    payload: { artistId }
  })
);

export const fetchArtistAlbums = createAction(
  "artist/albums",
  artistId => ({
    payload: { artistId }
  })
);

export const fetchPopularArtists = createAction(
  "artist/fetchPopular",
  page => ({
    payload: { page }
  })
);
