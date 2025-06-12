import { takeEvery, takeLatest } from 'redux-saga/effects';
import * as actions from 'core/actions';






export function* watchFetchLikeAlbum() {
  yield takeEvery(actions.fetchLikeAlbum, fetchlikeAlbumSaga);
}

export function* watchFetchUnLikeAlbum() {
  yield takeEvery(actions.fetchUnLikeAlbum, fetchlikeAlbumSaga);
}

export function* watchFetchArtist() {
  yield takeEvery(actions.fetchArtist, fetchArtistSaga);
}

export function* watchFetchArtistAlbums() {
  yield takeEvery(actions.fetchArtistAlbums, fetchArtistAlbumsSaga);
}

export function* watchFetchArtistImages() {
  yield takeEvery(actions.fetchArtistImages, fetchArtistImagesSaga);
}


export function* watchFetchRecommendations() {
  yield takeEvery(actions.fetchRecommendations, fetchRecommendationsSaga);
}

export function* watchFetchMovieCredits() {
  yield takeEvery(actions.fetchMovieCredits, fetchMovieCreditsSaga);
}

export function* watchFetchMovieVideos() {
  yield takeEvery(actions.fetchMovieVideos, fetchMovieVideosSaga);
}

export function* watchFetchMovieImages() {
  yield takeEvery(actions.fetchMovieImages, fetchMovieImagesSaga);
}

export function* watchFetchPopularMovies() {
  yield takeEvery(actions.fetchPopularMovies, fetchPopularMoviesSaga);
}



export function* watchFetchPopularAlbums() {
  yield takeEvery(actions.fetchPopularAlbums, fetchNewReleasesSaga);
}

export function* watchFetchMovie() {
  yield takeEvery(actions.fetchMovie, fetchMovieSaga);
}

export function* watchFetchMovieExternalIds() {
  yield takeEvery(actions.fetchMovieImdb, fetchMovieExternalIdsSaga);
}

export function* watchFetchPopularPeople() {
  yield takeEvery(actions.fetchPopularPeople, fetchPopularPeopleSaga);
}

export function* watchFetchPerson() {
  yield takeEvery(actions.fetchPerson, fetchPersonSaga);
}

export function* watchFetchPersonCredits() {
  yield takeEvery(actions.fetchPersonCredits, fetchPersonCreditsSaga);
}

export function* watchFetchPersonImages() {
  yield takeEvery(actions.fetchPersonImages, fetchPersonImagesSaga);
}

function* watchFetchMovieSearch() {
  yield takeEvery(actions.fetchMovieSearch, fetchMovieSearchSaga);
}

function* watchFetchWebSearch() {
  yield takeEvery(actions.fetchWebsiteSearch, fetchBraveWebSearchSaga);
  // yield takeLatest(actions.fetchWebsiteSearch, fetchBraveWebSearchSaga);
}
function* watchFetchImageSearch() {
  // yield takeEvery(actions.fetchImageSearch, fetchBraveImageSearchSaga);
  yield takeEvery(actions.fetchImageSearch, fetchBingImageSearchSaga);
}

function* watchFetchArtistSearch() {
  yield takeEvery(actions.fetchArtistSearch, fetchArtistSearchSaga);
}

function* watchFetchAlbumSearch() {
  yield takeEvery(actions.fetchAlbumSearch, fetchAlbumSearchSaga);
}

function* watchFetchTrackSearch() {
  yield takeEvery(actions.fetchTrackSearch, fetchTrackSearchSaga);
}

function* watchFetchPersonSearch() {
  yield takeEvery(actions.fetchPersonSearch, fetchPersonSearchSaga);
}

function* watchFetchSearch() {
  yield takeLatest(actions.fetchSearch, fetchSearchSaga);
}
function* watchFetchQuerySearch() {
  yield takeLatest(actions.fetchQuerySearch, fetchQuerySearchWorker);
}

export function* watchFetchTrack() {
  yield takeEvery(actions.fetchTrack, fetchTrackSaga);
}

export function* watchLogoutUser() {
  yield takeEvery(actions.fetchLogout, fetchLogout)
}

export function* watchFetchCurrentUser() {
  yield takeEvery(actions.fetchCurrentUser, fetchCurrentUserSaga);
}

export function* watchFetchAuthUser() {
  yield takeEvery(actions.fetchAuthUser, fetchAuthUserSaga);
}

function* watchFetchNewReleases() {
  yield takeEvery(actions.fetchNewReleases, fetchNewReleasesSaga);
}

function* watchPlaySong() {
  yield takeEvery(actions.playSong, fetchPlaySong);
}
