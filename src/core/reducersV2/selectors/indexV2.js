export const selectMovies = (state) => state.movies.movies;
export const selectMoviesLoading = (state) => state.movies.loading;
export const selectMoviesError = (state) => state.movies.error;

export const selectTracks = (state) => state.tracks.tracks;
export const selectTracksLoading = (state) => state.tracks.loading;
export const selectTracksError = (state) => state.tracks.error;

export const selectPlaylists = (state) => state.playlists.playlists;
export const selectPlaylistsLoading = (state) => state.playlists.loading;
export const selectPlaylistsError = (state) => state.playlists.error;

export const selectAlbums = (state) => state.albums.albums;
export const selectAlbumsLoading = (state) => state.albums.loading;
export const selectAlbumsError = (state) => state.albums.error;

export const selectPosts = (state) => state.post.posts; // List of posts
export const selectPostsLoading = (state) => state.post.loading; // Loading state for posts
export const selectPostsError = (state) => state.post.error; // Error state for posts
export const selectPostById = (id) => (state) => state.post.posts.find((post) => post.id === id); // Select specific post by ID

export const selectOAuthToken = (state) => state.oauth.token; // Access token
export const selectOAuthLoading = (state) => state.oauth.loading; // Loading state for OAuth
export const selectOAuthError = (state) => state.oauth.error; // Error state for OAuth
export const selectOAuthUser = (state) => state.oauth.user; // OAuth User info

export const selectUser = (state) => state.user.user; // User object
export const selectUserLoading = (state) => state.user.loading; // Loading state for user
export const selectUserError = (state) => state.user.error; // Error state for user
