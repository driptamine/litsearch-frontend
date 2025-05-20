import { createAction } from "@reduxjs/toolkit";

export const fetchLikeTrack = createAction(
  "like_track/fetch",
  (data) => ({
    payload: {
      id: data.track_uri,
      type: "tracks.track"
    }
  })
);

export const fetchUnLikeTrack = createAction(
  "unlike_track/fetch",
  (data) => ({
    payload: {
      id: data.track_uri,
      type: "tracks.track"
    }
  })
);

export const fetchTrackSearch = createAction(
  "track/search",
  (query, page, offset) => ({
    payload: { query, page, offset }
  })
);

export const fetchTrack = createAction(
  "track/fetch",
  (trackId, requiredFields) => ({
    payload: { trackId, requiredFields }
  })
);

export const fetchPopularTracks = createAction(
  "track/fetchPopular",
  page => ({
    payload: { page }
  })
);
