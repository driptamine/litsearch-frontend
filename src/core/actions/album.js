import { createAction } from "@reduxjs/toolkit";

export const fetchLikeAlbumOld = createAction(
  "like_album/fetch",
  (data) => ({
    payload: {
      id: data.id,
      type: "albums.album"
    }
  })
);

export const fetchUnLikeAlbumOld = createAction(
  "unlike_album/fetch",
  (data) => ({
    payload: {
      id: data.id,
      type: "albums.album"
    }
  })
);

export const fetchLikeAlbum = createAction(
  "like_album/fetch",
  (data) => ({
    payload: {
      id: data.album_uri,
      type: "albums.album"
    }
  })
);

export const fetchAlbum = createAction(
  "album/fetch",
  (albumId, requiredFields) => ({
    payload: { albumId, requiredFields }
  })
);

export const fetchPopularAlbums = createAction(
  "album/fetchPopular",
  (page) => ({
    payload: {
      page
    }
  })
);
