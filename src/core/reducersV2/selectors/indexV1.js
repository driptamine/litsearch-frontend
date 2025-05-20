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

  selectWebsites: (state, websiteIds) => websiteIds.map(websiteId => selectWebsite(state, websiteId)),
  selectImages: (state, imageIds) => imageIds.map(imageId => selectImage(state, imageId)),
  selectQueries: (state, queryIds) => queryIds.map(queryId => selectQuery(state, queryId)),

  selectMovies: (state, movieIds) => movieIds.map(movieId => selectMovie(state, movieId)),

  selectArtists: (state, artistIds) => artistIds.map(artistId => selectArtist(state, artistId)),
  selectAlbums: (state, albumIds) => albumIds.map(albumId => selectAlbum(state, albumId)),
  selectPlaylists: (state, playlistIds) => playlistIds.map(playlistId => selectPlaylist(state, playlistId)),
  selectArtistAlbums: (state, artistId) =>   state.artistAlbums[artistId],
    // state.artistAlbums[artistId]?.albums,
  selectPlaylistTracks: (state, playlistId) => state.playlistTracks[playlistId]?.tracks,
    // state.playlistTracks[playlistId]?.results,
  selectTracks: (state, trackIds) => trackIds.map(trackId => selectTrack(state, trackId)),


  selectGenre: (state, genreId) => state.genres[genreId],
  selectGenres: state => state.genres,
  selectMovieCredits: (state, movieId) => state.movieCredits[movieId],
  selectCastCredits: (state, castCreditId) => state.castCredits[castCreditId],

  selectPerson,
  selectPeople: (state, personIds) => personIds.map(personId => selectPerson(state, personId)),

  selectPersonCredits: (state, personId) => state.personCredits[personId],
  selectVideo: (state, videoId) => state.videos[videoId],
  selectMovieVideos: (state, movieId) => state.movieVideos[movieId]?.videos,

  selectMovieRecommendations: (state, movieId) => state.movieRecommendations[movieId]?.movies,


  selectMovieImages: (state, movieId) => state.movieImages[movieId]?.backdrops,
  selectPersonImages: (state, personId) => state.personImages[personId]?.profiles

};
