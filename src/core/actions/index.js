import { DEFAULT_FIRST_PAGE } from 'core/reducers/higherOrderReducers/createPagination';
import { createAction } from '@reduxjs/toolkit';

export const toggleDrawer = createAction("drawer/toggle");

export const fetchAuthUser = createAction(
  "login/fetch",
  (data) => ({
    payload: {
      email_or_username: data.email,
      password: data.password
    }
  })
);
// export const fetchSignUpUser = createAction(
//   "signup/fetch",
//   (data) => ({
//     payload: {
//       email: data.email,
//       password: data.password
//     }
//   })
// );

export const fetchOAuthUser = createAction(
  "user/oauth/setUserProfile",
  (data) => ({
    payload: {
      ...data
    }
  })
);

export const popupData = createAction(
  "popup_login/fetch",
  (data) => ({
    payload: {
      email: data.email,
      password: data.password
    }
  })
);

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

export const fetchLikeTrack = createAction(
  "like_track/fetch",
  (data) => ({
    payload: {
      id: data.track_uri,
      type: "tracks.track"
    }
  })
);

export const fetchLikePlaylist = createAction(
  "like_playlist/fetch",
  (data) => ({
    payload: {
      id: data.playlist_uri,
      type: "playlists.playlist"
    }
  })
);

export const fetchUnLikeAlbum = createAction(
  "unlike_album/fetch",
  (data) => ({
    payload: {
      id: data.album_uri,
      type: "albums.album"
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

export const fetchUnLikePlaylist = createAction(
  "unlike_playlist/fetch",
  (data) => ({
    payload: {
      id: data.playlist_uri,
      type: "playlists.playlist"
    }
  })
);

export const updateFieldsOfItem = createAction(
  "items/UP_FIELD_OF_ITEM",
  (entity, id, fields) => ({
    payload: {
      entity: entity,
      id: id,
      fields: fields
    }
  })
);


export const fetchCurrentUser = createAction(
  "user/fetchCurrentUser"
);

export const setUserProfile = createAction(
  "user/setUserProfile",
  (payload) => ({
    ...payload
  })
);

// export const setAccessToken = createAction(
//   "setToken/fetch",
//   (data) => ({
//     payload: {
//       access_token: data.result.access_token,
//       refresh_token: data.data.result.refresh_token
//     }
//   })
// );

export const setAccessToken = createAction(
  "setToken/fetch",
  (data) => ({
    payload: {
      ...data
    }
  })
);
export const getProfile = () => ({
   type: 'user/GE_USER_PROFILE'
});

export const fetchLogout = createAction(
  "logout/fetch",
  () => ({
    payload: {

    }
  })
);

export const fetchUserLoggedOut = createAction(
  "USER_LOGGEDOUT",
  () => ({

  })
)

export const fetchPopularMovies = createAction(
  "movie/fetchPopular",
  (page) => ({
    payload: {
      page
    }
  })
);

export const fetchPopularMagazines = createAction(
  "magazine/fetchPopular",
  (page) => ({
    payload: {
      page
    }
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

export const fetchPopularTracks = createAction(
  "track/fetchPopular",
  page => ({
    payload: { page }
  })
);

export const fetchPopularArtists = createAction(
  "artist/fetchPopular",
  page => ({
    payload: { page }
  })
);

export const fetchNewReleases = createAction(
  "new_releases/fetchPopular",
  page => ({
    payload: { page }
  })
);

export const fetchWebsite = createAction(
  "website/fetch",
  (websiteId, requiredFields) => ({
    payload: { websiteId, requiredFields }
  })
);
export const fetchMovie = createAction(
  "movie/fetch",
  (movieId, requiredFields) => ({
    payload: { movieId, requiredFields }
  })
);
export const fetchMovieImdb = createAction(
  "movie/fetch",
  (movieId, requiredFields) => ({
    payload: { movieId, requiredFields }
  })
);

export const fetchTrack = createAction(
  "track/fetch",
  (trackId, requiredFields) => ({
    payload: { trackId, requiredFields }
  })
);

// export const playSong = createAction(
//   "PLAY_SONG",
//   (song) => ({
//     payload: song
//   })
// );

export const playSong = (song) => {
  return {
    type: 'PLAY_SONG',
    song
  };
};

export const stopSong = () => {
  return {
    type: 'STOP_SONG'
  };
};

export const pauseSong = () => {
  return {
    type: 'PAUSE_SONG'
  };
};

export const resumeSong = () => {
  return {
    type: 'RESUME_SONG'
  };
};

export const increaseSongTime = (time) => {
  return {
    type: 'INCREASE_SONG_TIME',
    time
  };
};

export const updateViewType = (view) => {
  return {
    type: 'UPDATE_VIEW_TYPE',
    view
  };
};

export const updateVolume = (volume) => {
  return {
    type: 'UPDATE_VOLUME',
    volume
  };
};


export const fetchArtist = createAction(
  "artist/fetch",
  (artistId, requiredFields) => ({
    payload: { artistId, requiredFields }
  })
);

export const fetchAlbum = createAction(
  "album/fetch",
  (albumId, requiredFields) => ({
    payload: { albumId, requiredFields }
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

export const fetchPerson = createAction(
  "person/fetch",
  (personId, requiredFields) => ({
    payload: {
      personId,
      requiredFields
    }
  })
);



export const getAccessToken = createAction(
  "token/get",
  (code) => ({
    payload: {
      code: code
    }
  })
);

export const fetchSignUpUser = createAction(
  "signup/fetch",
  (email, username, password) => ({
    payload: {
      email,
      username,
      password
    }
  })
)

export const fetchRecommendations = createAction(
  "movie/fetchRecommendations",
  movieId => ({
    payload: { movieId }
  })
);
export const fetchVideoRecommendations = createAction(
  "video/fetchRecommendations",
  videoId => ({
    payload: { videoId }
  })
);

export const fetchArtistAlbums = createAction(
  "artist/albums",
  artistId => ({
    payload: { artistId }
  })
);

export const fetchGenres = createAction("genres/fetch");

export const fetchMovieCredits = createAction(
  "movies/fetchCredits",
  movieId => ({
    payload: { movieId }
  })
);

export const fetchPersonCredits = createAction(
  "person/fetchCredits",
  personId => ({
    payload: { personId }
  })
);

export const fetchPopularPeople = createAction(
  "person/fetchPopular",
  page => ({
    payload: { page }
  })
);

export const fetchMovieVideos = createAction(
  "movie/fetchVideos",
  movieId => ({
    payload: { movieId }
  })
);

export const fetchMovieImages = createAction(
  "movie/fetchImages",
  movieId => ({
    payload: { movieId }
  })
);

export const fetchPersonImages = createAction(
  "person/fetchImages",
  personId => ({
    payload: { personId }
  })
);

export const fetchArtistImages = createAction(
  "artist/fetchImages",
  artistId => ({
    payload: { artistId }
  })
);

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

export const fetchWebsiteSearch = createAction(
  "web/search",
  (query, page) => ({
    payload: { query, page }
  })
);
export const fetchImageSearch = createAction(
  "image/search",
  (query, page) => ({
    payload: { query, page }
  })
);
export const fetchQuerySearch = createAction(
  "query/search",
  (query, cursorPosition) => ({
    payload: { query, cursorPosition }
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

export const fetchPersonSearch = createAction(
  "person/search",
  (query, page) => ({
    payload: { query, page }
  })
);
