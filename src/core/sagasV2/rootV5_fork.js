import { fork, all } from 'redux-saga/effects';
// import * as watchers from 'core/watchers/watch';
import { watchFetchAlbum, watchFetchPopularAlbums, watchFetchLikeAlbum, watchFetchUnLikeAlbum } from 'core/sagasV2/album/album';
import { watchFetchArtist, watchFetchArtistAlbums, watchFetchArtistImages } from 'core/sagasV2/artist/artist';
import { watchFetchMovie, watchFetchPopularMovies, watchFetchMovieExternalIds, watchFetchRecommendations, watchFetchMovieImages, watchFetchMovieCredits, watchFetchMovieVideos} from 'core/sagasV2/movie/movie';
import { watchFetchPerson, watchFetchPopularPeople, watchFetchPersonImages, watchFetchPersonCredits} from 'core/sagasV2/person/person';
import { watchFetchPlaylist, watchFetchOffsetPlaylist } from 'core/sagasV2/playlist/playlist';
import { watchFetchNewReleases, } from 'core/sagasV2/post/post';
import { watchFetchWebSearch, watchFetchImageSearch, watchFetchSearch, watchFetchQuerySearch, watchFetchMovieSearch, watchFetchPersonSearch, watchFetchArtistSearch, watchFetchAlbumSearch, watchFetchTrackSearch } from 'core/sagasV2/search/search';
import { watchFetchTrack } from 'core/sagasV2/track/track';
import { watchFetchAuthUser, watchFetchCurrentUser, watchLogoutUser } from 'core/sagasV2/user/user';

export default function* rootSaga() {
  yield all([

     fork(watchFetchMovie),
     fork(watchFetchPopularMovies),
     watchFetchMovieExternalIds,
     watchFetchRecommendations,


     fork(watchFetchWebSearch),
     watchFetchImageSearch,
     fork(watchFetchSearch),
     fork(watchFetchQuerySearch),


     watchFetchMovieSearch,


  ]);
}
