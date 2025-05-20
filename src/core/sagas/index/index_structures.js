// esinoks-quiz-app onderonur saga version
import { all } from "redux-saga/effects";
import authSagas from "sagas/auth";
import questionsSagas from "sagas/questions";
import quizzesSagas from "sagas/quizzes";
import routingSagas from "sagas/routing";

export default function* root() {
  yield all([
    ...authSagas,
    ...questionsSagas,
    ...quizzesSagas,
    ...routingSagas
  ]);
}


// unsplash saga version project structure

import { fork, all } from 'redux-saga/effects';
import { getAccessTokenF, logOutF, getMyProfileF } from './user';
import { getPhotosF,getPhotosesF, likePhotoF, unLikePhotoF, searchInPhotosF } from './photo';
import {
  getUserCollectionsF,
  getCollectionF,
  getCollectionPhotosF,
  searchInCollectionsF,
  createCollectionF,
  updateCollectionF,
  deleteCollectionF,
  addPhotoToCollectionF,
  removePhotoFromCollectionF,
} from './collection';

export default function* root() {
  yield all([
    // user saga flows
    fork(getAccessTokenF),
    fork(logOutF),
    fork(getMyProfileF),
    // photo saga flows
    fork(getPhotosF),
    fork(getPhotosesF),
    fork(likePhotoF),
    fork(unLikePhotoF),
    fork(searchInPhotosF),
    // collection saga flow
    fork(getUserCollectionsF),
    fork(getCollectionF),
    fork(getCollectionPhotosF),
    fork(searchInCollectionsF),
    fork(createCollectionF),
    fork(updateCollectionF),
    fork(deleteCollectionF),
    fork(addPhotoToCollectionF),
    fork(removePhotoFromCollectionF),
  ]);
}
