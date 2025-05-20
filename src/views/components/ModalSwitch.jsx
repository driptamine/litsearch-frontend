import React, { useEffect, useRef, useReducer, useState, useCallback, useMemo } from 'react';
import { Switch, Route, Redirect, withRouter, useLocation, useHistory } from "react-router-dom";
import styled from 'styled-components';
// CHAT
import ChatList from 'views/pages/ChatV3/Left/ChatList';
import ChatWindow from 'views/pages/ChatV3/Main/ChatWindow';
// import chatsData from 'views/pages/ChatV3/chats.json';
import chatsData from 'views/pages/ChatV3/chatsV2.json';
import emojiData from 'views/pages/ChatV3/emoji.json';
// UPLOAD
import LargeFileUpload from "views/components/upload/LargeFileUpload";
import ChunkUpload from "views/components/upload/ChunkUpload";
import UploadGPTaxios from "views/components/upload/UploadToEC2GPTaxios";
// import VideoUploaderGPT from "views/components/upload/VideoUploaderGPT";
// import VideoUploaderGPT from "views/components/upload/VideoUploaderGPTV2";
// import VideoUploaderGPT from "views/components/upload/VideoUploaderGPTV3";
// import VideoUploaderGPT from "views/components/upload/VideoUploaderGPTV4";
import VideoUploaderGPT from "views/components/upload/VideoUploaderGPTV4Multi";
import PostCreator from "views/components/upload/PostCreator";

import ModalCustom from "views/components/ModalCustom";
import ModalRoute from "views/components/ModalRoute";
import ModalMovie from "views/components/ModalMovie";
import ModalMovies from "views/components/ModalMovies";
import ModalPosts from "views/pages/PopularPosts/ModalPosts";
import TrackListLoopV2 from "views/pages/PopularMusic/indexV2";
import TrackListLoopV1 from "views/pages/PopularMusic/index";
import ModalPeople from "views/components/ModalPeople";
import ModalMagazines from "views/components/ModalMagazines";
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
import LinksProfile from "views/pages/LinksProfile";

import LoginPage from "views/pages/LoginPage";
import SignUpPage from "views/pages/SignUpPage";

// import MainSearch from "views/pages/MainSearch";
import SearchApp from "views/pages/MainSearch/searchbar/App";
import SearchAppp from "views/pages/MainSearch/StartPage/App";


import GoogleCallback from "views/pages/LoginPage/oauth/GoogleCallback";
import OAuthCallback from "views/pages/LoginPage/oauth/OAuthCallback";
import OAuthPopup from "views/pages/LoginPage/pocket/oauth2popup";

import TwitchAuthCallback from "views/pages/Auth/TwitchAuthCallback";
import GoogleAuthCallback from "views/pages/Auth/GoogleAuthCallback";
// import SpotifyAuthCallback from "views/pages/Auth/SpotifyAuthCallback";
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
  const { pathname } = useLocation();
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

  useEffect(() => {
    if (isModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'visible';
  }, [isModal]);

  // useScrollRestoration();
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

  const showChatList = location.pathname.startsWith('/chat');

  return (
    <ModalRouteContext.Provider value={contextValue}>
      {/*<div style={{'display': 'flex'}}>*/}
      {/*{showChatList && <ChatAppContainer>}*/}
      {/*<ChatAppContainer>*/}



      {/*<FlexDiv>*/}

      {/*{(pathname == '/chat/im' ? (<ChatList users={chatsData.users}/>) : null )}*/}
      {showChatList && <ChatList users={chatsData.users} messages={chatsData.messages} emojiData={emojiData} />}
      <Switch location={switchLocation} back={location}>
        {/*{children}*/}
        {/*<Route exact path="/movies" component={PopularMovies} />*/}

        <Route path="/login" render={props => auth ? ( <Redirect to={{pathname: '/movies',}} /> ) : ( <LoginPage {...props} /> )} />
        <Route path="/signup" render={props => auth ? ( <Redirect to={{pathname: '/movies',}} /> ) : ( <SignUpPage {...props} /> )} />
        {/*<Route exact path="/login" component={LoginPage} />*/}
        {/*<Route path="/auth/twitch/callback" element={<TwitchAuthCallback />} />*/}
        <Route path="/auth/twitch/callback" component={TwitchAuthCallback} />

        <Route path="/auth/google/callback" component={GoogleAuthCallback} />
        {/*<Route exact path="/auth/spotify/callback" component={SpotifyAuthCallback} />*/}

        {/*<Route exact path="/auth/youtube/callback" component={YoutubeAuthCallback} />*/}
        {/*<Route exact path="/auth/unsplash/callback" component={UnsplashCallback} />*/}
        {/*<Route  path="/auth/unsplash/callback" component={UnsplashCallback} />*/}
        {/*<Route  path="/auth/unsplash/callback" element={<UnsplashCallback />} />*/}


        {/*<Route element={<OAuthPopup />} path="/auth/provider/callback" />*/}

        {/*<Route exact path="/auth/callback" component={OAuthCallback} />*/}

        {/*<Route exact path="/upload" component={AddData} />*/}
        {/*<Route exact path="/fu" component={FileUpload} />*/}
        {/*<Route exact path="/upload" component={FineUploader} />*/}
        {/*<Route exact path="/uploader" component={GalleryFineUploader} />*/}
        <Route exact path="/lu" component={LargeFileUpload} />
        <Route exact path="/cu" component={ChunkUpload} />

        <Route exact path="/ax" component={UploadGPTaxios} />
        <Route exact path="/s3upload" component={VideoUploaderGPT} />

        <Route exact path="/create" component={PostCreator} />

        <Route exact path="/movies" component={ModalMovies} />
        <Route exact path="/feed" component={ModalMovies} />
        <Route exact path="/feedV2" component={ModalPosts} />
        <Route exact path="/people" component={ModalPeople} />

        <Route exact path="/magazines" component={ModalMagazines} />


        {/*<Route exact path="/feed" component={ModalPhotos} />*/}
        {/*<Route exact path="/" component={MainSearch} />*/}
        {/*<Route exact path="/" component={SearchApp} />*/}
        <Route exact path="/" component={SearchAppp} />

        {/*<Route exact path="/chat"><Main /></Route>*/}


        {/*<Route exact path="/album" component={ModalMovies} />*/}
        {/*<Route path="/movies/:id" component={ModalMovie} />*/}
        {/*<Route path="/movies/:id" component={MovieCard} />*/}
        {/*<Route path="/album/:albumId" component={AlbumProfile}/>*/}
        {/*<Route path="/track/:trackId" component={TrackProfile}/>*/}


        <Route path="/movies/:movieId" component={MovieProfile} />
        <Route path="/person/:personId" component={PersonProfile} />

        {/*<Route path="/movies/:movieId">
          <MovieProfile
            stopSong={stopSong}
            pauseSong={pauseSong}
            resumeSong={resumeSong}
            audioControl={audioControl}
          />
        </Route>*/}
        <Route exact path="/search/:searchType">
          <SearchResults />
        </Route>


        {/*<Route exact path="/chat/im">
          <ChatList users={chatsData.users} />
        </Route>*/}
        <Route exact path="/chat/:userId" component={ChatWindow} />

        <Route exact path="/musicv2" component={TrackListLoopV2} />
        <Route exact path="/musicv1" component={TrackListLoopV1} />




        <Route exact path="/searches/:query" component={SearchesResults} />
        <Route exact path="/searches/:type/:query" component={SearchesResults} />

        {/*<Route path="/person/:personId">
          <PersonProfile
            stopSong={stopSong}
            pauseSong={pauseSong}
            resumeSong={resumeSong}
            audioControl={audioControl}
          />
        </Route>*/}

        <Route path="/artist/:artistId">
          <ArtistProfile
            stopSong={stopSong}
            pauseSong={pauseSong}
            resumeSong={resumeSong}
            audioControl={audioControl}
          />
        </Route>

        <Route exact path="/albums" component={ModalAlbums} />

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
        <Route path="/vine/:videoId">
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
        <Route path="/links/:linkId">
          <LinksProfile
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
      </Switch>

      {/*</ChatAppContainer>*/}

      {isModal && renderModal({open: isModal,redirectToBack, location})}
    </ModalRouteContext.Provider>
  );
}

const FlexDiv = styled.div`

`
const ChatAppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`
export default ModalSwitch;
