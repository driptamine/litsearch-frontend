import produce from 'immer';
import merge from 'lodash/merge';

const initialState = {
  websites: {},
  queries: {},
  images: {},
  
  movies: {},

  tracks: {

  },
  artists: {

  },
  albums: {},
  playlists: {},
  playlistTracks: {
    songPlaying: false,
    songPaused: true,
    timeElapsed: 0,
    songId: 0,
  },
  artistAlbums: {},
  genres: {},
  movieCredits: {},
  castCredits: {},
  people: {},
  personCredits: {},
  videos: {},
  movieVideos: {},
  movieRecommendations: {},
  // images: {},
  movieImages: {},
  personImages: {}
};

const entities = (state = initialState, action) => {
  return produce(state, draft => {
    const { payload } = action;
    const entities = payload?.response?.entities;
    if (entities) {
      draft = merge(draft, entities);
    }

    switch (action.type) {

      case 'items/UP_FIELD_OF_ITEM':
      // return { ...state, response };
      return Object.assign({}, state,
        {
          albums: {
            ...state.albums, [action.payload.id]: action.payload.fields
          }
        }
      );

      case "PLAY_SONG":
        return {
          // playlistTracks: {
          //   ...state,
          //   songPlaying: true,
          //   songDetails: action.song,
          //   songId: action.song.id,
          //   timeElapsed: 0,
          //   songPaused: false
          // }

          // ...state,
          // songPlaying: true,
          // songDetails: action.song,
          // songId: action.song.id,
          // timeElapsed: 0,
          // songPaused: false

          ...state,
          playlistTracks: {
            ...state.playlistTracks,
            songPlaying: true,
            songDetails: action.song,
            songId: action.song.id,
            timeElapsed: 0,
            songPaused: false
          }

        };

        // return Object.assign({}, state,
        //   {
        //     playlistTracks: {
        //       ...state.playlistTracks, [action.payload.id]: action.payload.fields
        //     }
        //   }
        // );

      case "STOP_SONG":
        return {

          // playlistTracks: {
          //     ...state,
          //   songPlaying: false,
          //   songDetails: null,
          //   timeElapsed: 0,
          //   songPaused: true
          // }


          // ...state,
          // songPlaying: false,
          // songDetails: null,
          // timeElapsed: 0,
          // songPaused: true

          ...state,
          playlistTracks: {
            ...state.playlistTracks,
            songPlaying: false,
            songDetails: null,
            timeElapsed: 0,
            songPaused: true
          }


        };

      case "PAUSE_SONG":
        return {
          // playlistTracks: {
          //   ...state,
          //   songPaused: true
          // }

          // ...state,
          // songPaused: true

          ...state,
          playlistTracks: {
            ...state.playlistTracks,
            songPaused: true
          }
        };

      case "RESUME_SONG":
        return {
          // playlistTracks: {
          //   ...state,
          //   songPaused: false
          // }

          // ...state,
          // songPaused: false


          ...state,
          playlistTracks: {
            ...state.playlistTracks,

            songPaused: false
          }

        };

      case "INCREASE_SONG_TIME":
        return {
          // playlistTracks: {
          //   ...state,
          //   timeElapsed: action.time
          // }
          // ...state,
          // timeElapsed: action.time

          ...state,
          playlistTracks: {
            ...state.playlistTracks,

            timeElapsed: action.time
          }
        };
      // default:
      //   return state
    }

  });
};

// Default export is the "reducer".
export default entities;

const selectWebsite = (state, websiteId) => state.websites[websiteId];
const selectImage = (state, imageId) => state.images[imageId];
const selectQuery = (state, queryId) => state.queries[queryId];

const selectMovie = (state, movieId) => state.movies[movieId];
const selectImdbMovie = (state, movieId) => state.movies[movieId];
const selectPerson = (state, personId) => state.people[personId];
const selectArtist = (state, artistId) => state.artists[artistId];
const selectAlbum = (state, albumId) => state.albums[albumId];
const selectPlaylist = (state, playlistId) => state.playlists[playlistId];
const selectPlaylistTrack = (state, playlistId) => state.playlistTracks[playlistId];
const selectTrack = (state, trackId) => state.tracks[trackId];
// const likeAlbum = () =>
// const unlikeAlbum = () =>
// const albumLikers = () =>


// All the named exports are "selectors" of this state slice.
// The "state" parameter here is the same state slice as the "entities" reducer itself.
// No need to use it like "state.entities...".
export const selectors = {
  selectWebsite,
  selectImage,
  selectQuery,

  selectMovie,
  selectImdbMovie,
  selectArtist,
  selectAlbum,
  selectPlaylist,
  selectPlaylistTrack,
  selectTrack,

  selectWebsites: (state, websiteIds) =>
    websiteIds.map(websiteId => selectWebsite(state, websiteId)),
  selectImages: (state, imageIds) =>
    imageIds.map(imageId => selectImage(state, imageId)),
  selectQueries: (state, queryIds) =>
    queryIds.map(queryId => selectQuery(state, queryId)),

  selectMovies: (state, movieIds) =>
    movieIds.map(movieId => selectMovie(state, movieId)),

  selectArtists: (state, artistIds) =>
    artistIds.map(artistId => selectArtist(state, artistId)),

  selectAlbums: (state, albumIds) =>
    albumIds.map(albumId => selectAlbum(state, albumId)),

  selectPlaylists: (state, playlistIds) =>
    playlistIds.map(playlistId => selectPlaylist(state, playlistId)),


  selectArtistAlbums: (state, artistId) =>
    // state.artistAlbums[artistId]?.albums,
    state.artistAlbums[artistId],

  selectPlaylistTracks: (state, playlistId) =>
    // state.playlistTracks[playlistId]?.results,
    state.playlistTracks[playlistId]?.tracks,


  selectTracks: (state, trackIds) =>
    trackIds.map(trackId => selectTrack(state, trackId)),

  selectGenre: (state, genreId) => state.genres[genreId],
  selectGenres: state => state.genres,
  selectMovieCredits: (state, movieId) => state.movieCredits[movieId],
  selectCastCredits: (state, castCreditId) => state.castCredits[castCreditId],
  selectPerson,
  selectPeople: (state, personIds) =>
    personIds.map(personId => selectPerson(state, personId)),
  selectPersonCredits: (state, personId) => state.personCredits[personId],
  selectVideo: (state, videoId) => state.videos[videoId],
  selectMovieVideos: (state, movieId) => state.movieVideos[movieId]?.videos,

  selectMovieRecommendations: (state, movieId) =>
    state.movieRecommendations[movieId]?.movies,

  selectMovieImages: (state, movieId) => state.movieImages[movieId]?.backdrops,
  selectPersonImages: (state, personId) =>
    state.personImages[personId]?.profiles
};
