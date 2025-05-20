import React, { useEffect, useRef, useReducer, useState, useCallback, useMemo } from 'react';
import { Routes, Route, Redirect, withRouter, useLocation, useHistory } from "react-router-dom";

// import ModalMui from "./ModalMui";
// import ModalRoute from "./ModalRoute";
// import ModalMovie from "./ModalMovie";

// import PopularMovies from "../pages/PopularMovies";
// import AddData from "views/components/upload/addData";
import FileUpload from "views/components/upload/FileUpload";
import FineUploader from "views/components/upload/FineUploader";
import GalleryFineUploader from "views/components/upload/GalleryFineUploader";
import LargeFileUpload from "views/components/upload/LargeFileUpload";
import ChunkUpload from "views/components/upload/ChunkUpload";

import ModalCustom from "views/components/ModalCustom";
import ModalRoute from "views/components/ModalRoute";
import ModalMovie from "views/components/ModalMovie";
import ModalMovies from "views/components/ModalMovies";
import ModalPeople from "views/components/ModalPeople";
// import ModalPhotos from "views/components/ModalPhotos";
import ModalAlbums from "views/components/ModalAlbums";
import MovieCard from "views/components/MovieCard";

// import PopularMovies from "views/pages/PopularMovies";
import MovieProfile from "views/pages/MovieProfile";
import VideoProfile from "views/pages/VideoProfile";


import SearchResults from "views/pages/SearchResults";
import SearchesResults from "views/pages/SearchResults";


import PersonProfile from "views/pages/PersonProfile";
import ArtistProfile from "views/pages/ArtistProfile";
import AlbumProfile from "views/pages/AlbumProfile";
import PlaylistProfile from "views/pages/PlaylistProfile";
import TrackProfile from "views/pages/TrackProfile";

import LoginPage from "views/pages/LoginPage";
import GoogleCallback from "views/pages/LoginPage/oauth/GoogleCallback";
import OAuthCallback from "views/pages/LoginPage/oauth/OAuthCallback";
import OAuthPopup from "views/pages/LoginPage/pocket/oauth2popup";

import TwitchAuthCallback from "views/pages/Auth/TwitchAuthCallback";
import GoogleAuthCallback from "views/pages/Auth/GoogleAuthCallback";
import SpotifyAuthCallback from "views/pages/Auth/SpotifyAuthCallback";
// import UnsplashCallback from "views/pages/LoginPage/UnsplashCallback";


// import LoginPageOauth from "views/pages/LoginPage";

// import Main from '/views/pages/Chat/Main/Main.async';

// CORE
import useScrollRestoration from "core/hooks/useScrollRestoration";
import useScrollMemory from "core/hooks/useScrollMemory";

import { getState } from 'core/store';

export const ModalRouteContext = React.createContext();

// action types
const PUSH_MODAL_LOCATION_KEY = 'PUSH_MODAL_LOCATION';
const CLEAR_MODAL_LOCATION_KEYS = 'CLEAR_MODAL_LOCATION';
const SET_MODAL_LOCATION_KEYS = 'SET_MODAL_LOCATION';

// backgroundLocationKeys
const PUSH_BACKGROUND_LOCATION_KEY = 'PUSH_BACKGROUND_LOCATION';
const CLEAR_BACKGROUND_LOCATION_KEYS = 'CLEAR_BACKGROUND_LOCATION';
const SET_BACKGROUND_LOCATION_KEYS = 'SET_BACKGROUND_LOCATION';

// initial state
const initialState = {
  modalLocationKeys: [],
  backgroundLocationKeys: []
};

// reducer
function reducer(state, action) {
  switch (action.type) {
    case PUSH_MODAL_LOCATION_KEY: {
      const { modalLocationKeys } = state;
      const newKeys = [...modalLocationKeys, action.key];
      return { ...state, modalLocationKeys: newKeys };
    }
    case CLEAR_MODAL_LOCATION_KEYS:
      return { ...state, modalLocationKeys: [] };
    case SET_MODAL_LOCATION_KEYS:
      return { ...state, modalLocationKeys: action.modalLocationKeys };

    case PUSH_BACKGROUND_LOCATION_KEY: {
      const { backgroundLocationKeys  } = state
      const backgroundKeys = [...backgroundLocationKeys, action.key];
      return { ...state,  backgroundLocationKeys: backgroundKeys };
    }
    case CLEAR_BACKGROUND_LOCATION_KEYS:
      return { ...state, backgroundLocationKeys: [] };
    case SET_BACKGROUND_LOCATION_KEYS:
      return { ...state, backgroundLocationKeys: action.backgroundLocationKeys };
    default:
      return state;
  }
}

// function ModalSwitch({ history,location, children, renderModal }) {
function ModalSwitch({  children, renderModal, stopSong, pauseSong, resumeSong, audioControl }) {

  const location = useLocation();
  const history = useHistory();
  // useScrollRestoration();
  // useScrollMemory();

  const backgroundLocation = useRef(location);
  console.log("location: "+history);
  const [state, dispatch] = useReducer(reducer, initialState);

  const checkIfStartedWithModal = useCallback(() => {
    return !!(
      location.state &&
      location.state.defaultParentPath
    );
  }, [location]);

  const checkIfStartedWithModals = useCallback(() => {
    return !!(
      location.state &&
      location.state.modal &&
      location.state.defaultParentPath
    );
  }, [location]);

  const [startedWithModal, setStartedWithModal] = useState();

  const { modalLocationKeys, backgroundLocationKeys } = state;

  // const isModalz = location.state && location.state.modal;
  const isInitialRender = backgroundLocation === location;
  // const reRenderRoute = !isModalz || isInitialRender;

  useEffect(() => {
    const keysLength = modalLocationKeys.length;
    const locationKey = location.key;

    const backgroundKeysLength = backgroundLocationKeys.length;

    function clearModalLocationKeys() {
      if (modalLocationKeys.length) {
        console.log('CLEAR_MODAL_LOCATION_KEYS');
        dispatch({ type: CLEAR_MODAL_LOCATION_KEYS });
      }
    }

    // IMPORTANT NOTE:
    // ModalSwitch uses "location.key" to handle history navigation.
    // When the user click the back or forward button of the browser, it uses "location.key" to
    // decide which one is clicked.
    // Because of HashRouter doesn't have a "location.key" or "location.state", it breaks this behavior.
    function handleHistoryNavigation() {
      if (keysLength) {
        const index = modalLocationKeys.indexOf(locationKey);
        let newKeys = modalLocationKeys;

        const lastIndex = modalLocationKeys.length - 1;

        if (index >= 0 && index !== lastIndex) {
          // Browser's "back" button is clicked
          console.log('NAZAD');
          newKeys = newKeys.slice(0, index + 1);
          // backgroundLocation.current = location.state.backgroundLokation;
        } else if (index < 0) {
          // Key not found in stored location keys
          // Browser's "forward" button is clicked
          console.log('VPERED');
          newKeys = [...newKeys, locationKey];
        }

        dispatch({
          type: SET_MODAL_LOCATION_KEYS,
          modalLocationKeys: newKeys
        });
        console.log('SET_MODAL_LOCATION_KEYS');
      }
    }

    function handleBackGroundHistoryNavigation() {
      if (backgroundKeysLength) {
        const index = backgroundLocationKeys.indexOf(locationKey);
        let newKeys = backgroundLocationKeys;

        const lastIndex = backgroundLocationKeys.length - 1;

        if (index >= 0 && index !== lastIndex) {
          // Browser's "back" button is clicked
          console.log('NAZAD');
          newKeys = newKeys.slice(0, index + 1);
          // backgroundLocation.current = location.state.backgroundLokation;
        } else if (index < 0) {
          // Key not found in stored location keys
          // Browser's "forward" button is clicked
          console.log('VPERED');
          newKeys = [...newKeys, locationKey];
        }

        if (!backgroundLocationKeys.includes(backgroundLocation.current.pathname)) {
          dispatch({
            type: SET_BACKGROUND_LOCATION_KEYS,
            key: backgroundLocation.current.pathname
          });
          console.log('PUSH_BACKGROUND_LOCATION_KEY');
        }
        // dispatch({
        //   type: SET_BACKGROUND_LOCATION_KEYS,
        //   backgroundLocationKeys: newKeys
        // });
      }
    }

    function splitPathnameAndQueryString(path) {
      const [pathname, search] = path.split('?');

      return {
        pathname,
        search: search ? `?${search}` : ''
      };
    }

    // Location has a modal and defaultParentPath in its state.
    // Meaning that the user opened the modal directly by url wihout previous navigation. (startedWithModal)
    // Thus, we are setting this info to state.
    if (checkIfStartedWithModals()) {
      const { pathname, search, key } = splitPathnameAndQueryString(location.state.defaultParentPath);

      console.log('STARTED w/ MODALS');
      backgroundLocation.current = {
        pathname,
        search,
        key,
        hash: 'checkIfStartedWithModals'
      };

      clearModalLocationKeys();

      setStartedWithModal(true);
    } else if (!location.state || !location.state.modal) {
      // } else if (!location.state.modal) {
      // } else if (!location.state) {
      // User opened a non-modal route by typing on TAB

      console.log(history.action);
      console.log('non-modal TAB');
      backgroundLocation.current = location;

      clearModalLocationKeys();
      if (!backgroundLocationKeys.includes(backgroundLocation.current.pathname)) {
        dispatch({
          type: PUSH_BACKGROUND_LOCATION_KEY,
          key: backgroundLocation.current.pathname
        });
        console.log('PUSH_BACKGROUND_LOCATION_KEY');
      }
      setStartedWithModal(false);
    } else if (!startedWithModal) {

      // User opened a modal but didn't start by directly entering a modal route
      if (history.action === 'POP') {

        console.log('PHOTO PAGE');
        console.log(history.action);
        handleHistoryNavigation();
        handleBackGroundHistoryNavigation();
        // console.log("handleHistoryNavigation");
      } else if (history.action !== 'REPLACE') {
        // "history.replace" is called inside a modal route.
        // We should not add a location key to modal location keys array in this situation.
        // Or else, we will go back more than we want when the modal is closed.
        if (!modalLocationKeys.includes(locationKey)) {
          console.log(history.action);
          dispatch({
            type: PUSH_MODAL_LOCATION_KEY,
            key: locationKey
          });
          console.log('PUSH_MODAL_LOCATION_KEY');

        }
        // if (!backgroundLocationKeys.includes(backgroundLocation.current)) {
        //   dispatch({
        //     type: PUSH_BACKGROUND_LOCATION_KEY,
        //     key: backgroundLocation.current
        //   });
        //   console.log('PUSH_BACKGROUND_LOCATION_KEY');
        // }
      }
    }

  }, [
    location,
    history,
    modalLocationKeys,
    startedWithModal,
    checkIfStartedWithModal
  ]);

  const redirectToBack = useCallback(() => {
    const prevLocation = backgroundLocation.current;

    const keysLength = modalLocationKeys.length;

    if (keysLength) {
      history.go(-keysLength);
    } else {
      history.push(prevLocation.pathname);
    }
  }, [history, modalLocationKeys.length]);

  const isModal = !!(location.state && location.state.modal && backgroundLocation.current !== backgroundLocation ); // not initial render

  const switchLocation = isModal ? backgroundLocation.current : location;

  const contextValue = useMemo(() => {
    return {
      redirectToBack,
      backgroundLocation: backgroundLocation.current,
      isModal
    };
  }, [isModal, redirectToBack]);

  // const auth = getState().users.id;
  const auth = getState().users.access_token;
  // useScrollMemory();
  return (
    <ModalRouteContext.Provider value={contextValue}>
      <Routes location={switchLocation} back={location}>
        {/*{children}*/}
        {/*<Route exact path="/movies" element={<PopularMovies} />*/}

        {/*<Route path="/login" render={props => auth ? ( <Redirect to={{pathname: '/movies',}} /> ) : ( <LoginPage {...props} /> )} />*/}

        {/*<Route path="/auth/twitch/callback" element={<TwitchAuthCallback />} />*/}
        {/*<Route path="/auth/twitch/callback" element={<TwitchAuthCallback} />*/}
        {/*<Route path="/auth/google/callback" element={<GoogleAuthCallback} />*/}
        {/*<Route exact path="/auth/spotify/callback" element={<SpotifyAuthCallback} />*/}

        {/*<Route exact path="/auth/youtube/callback" element={<YoutubeAuthCallback} />*/}
        {/*<Route exact path="/auth/unsplash/callback" element={<UnsplashCallback} />*/}
        {/*<Route  path="/auth/unsplash/callback" element={<UnsplashCallback} />*/}
        {/*<Route  path="/auth/unsplash/callback" element={<UnsplashCallback />} />*/}


        {/*<Route element={<<OAuthPopup />} path="/auth/provider/callback" />*/}

        {/*<Route exact path="/auth/callback" element={<OAuthCallback} />*/}

        {/*<Route exact path="/upload" element={<AddData />} />*/}
        <Route exact path="/fu" element={<FileUpload />} />
        <Route exact path="/upload" element={<FineUploader />} />
        <Route exact path="/uploader" element={<GalleryFineUploader />} />
        <Route exact path="/lu" element={<LargeFileUpload />} />
        <Route exact path="/cu" element={<ChunkUpload />} />

        <Route exact path="/movies" element={<ModalMovies />} />
        <Route exact path="/feed" element={<ModalMovies />} />
        <Route exact path="/people" element={<ModalPeople />} />
        {/*<Route exact path="/feed" element={<ModalPhotos />} />*/}
        <Route exact path="/" element={<ModalMovies />} />

        {/*<Route exact path="/chat"><Main /></Route>*/}


        {/*<Route exact path="/album" element={<ModalMovies />} />*/}
        {/*<Route path="/movies/:id" element={<ModalMovie />} />*/}
        {/*<Route path="/movies/:id" element={<MovieCard />} />*/}
        {/*<Route path="/album/:albumId" element={<AlbumProfile />}/>*/}
        {/*<Route path="/track/:trackId" element={<TrackProfile />}/>*/}


        <Route path="/movies/:movieId" element={<MovieProfile />} />

        <Route exact path="/search/:searchType">
          <SearchResults />
        </Route>


        <Route exact path="/searches/:query" element={<SearchesResults />} />
        <Route exact path="/searches/:type/:query" element={<SearchesResults />} />

        <Route path="/person/:personId">
          <PersonProfile />
        </Route>

        <Route path="/artist/:artistId">
          <ArtistProfile />
        </Route>

        <Route exact path="/albums" element={<ModalAlbums />} />

        <Route path="/album/:albumId">
          <AlbumProfile
            stopSong={stopSong}
            pauseSong={pauseSong}
            resumeSong={resumeSong}
            audioControl={audioControl}
          />
        </Route>

        <Route path="/video/:videoId">
          <VideoProfile />
        </Route>

        <Route path="/playlist/:playlistId">
          <PlaylistProfile
            stopSong={stopSong}
            pauseSong={pauseSong}
            resumeSong={resumeSong}
            audioControl={audioControl}
          />
        </Route>

        <Route path="/track/:trackId">
          <TrackProfile />
        </Route>
        {/*<Route path="/post/:postId">
          <PostProfile />
        </Route>*/}

        {/*<Route path="*"><Redirect to="/movies" /> </Route>*/}
      </Routes>
      {isModal && renderModal({open: isModal,redirectToBack, location})}
    </ModalRouteContext.Provider>
  );
}

export default ModalSwitch;
