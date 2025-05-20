import { createAction } from "@reduxjs/toolkit";

export const fetchLikePlaylist = createAction(
  "like_playlist/fetch",
  (data) => ({
    payload: {
      id: data.playlist_uri,
      type: "playlists.playlist"
    }
  })
);

export const fetchUnLikePlaylist = createAction(
  "unlike_playlist/fetch",
  (data) => ({
    payload: {
      id: data.playlist_uri,
      type: "playlists.playlist"
    }
  })
);

export const fetchPlaylist = createAction(
  "playlist/fetch",
  (playlistId, page, offset) => ({
    payload: { playlistId, page, offset }
  })
);

export const fetchPlaylistTracks = createAction(
  "playlistTracks/fetch",
  (playlistId, page, offset) => ({
    payload: { playlistId, page, offset }
  })
);
