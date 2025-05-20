import React, { useEffect, useContext, useCallback, useState } from "react";
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Route, useLocation } from 'react-router-dom';
import { connect, useDispatch, useSelector } from "react-redux";
import { RecoilRoot } from 'recoil';
import styled, { ThemeProvider } from 'styled-components';
import { useThemeMode } from "views/components/Toggle/useThemeMode"

import useKeyboardShortcut from 'use-keyboard-shortcut';
import './index.css';
// VIEWS
import LoginPage from "views/pages/LoginPage";
import Container from "views/styles/Container";
import SidebarContainer from "views/styles/SidebarContainer";

import LegacyRoutes from "views/components/Routes/legacy";
import ModalRoutes from "views/components/ModalRoutes";

import LoadingIndicator from "views/components/LoadingIndicator";
import AppHeader from "views/components/AppHeader";
import AppDrawer from "views/components/AppDrawer";
// import BackToTopButton from "views/components/BackToTopButton";
// import Player from "views/components/player/Player";
import SideMenu from "views/components/SideMenu";
import UserPlaylists from "views/components/UserPlaylists";
import Footer from 'views/components/footer/Footer';
import { maxWidthContent } from 'views/style/util';

import GlobalStyle from 'views/styles/GlobalStyle';
import GlobalStyleThemeMode from 'views/styles/GlobalStyleThemeMode';
import Toggle from 'views/components/Toggle/Toggler';
// import GlobalStyleThemeMode from 'views/components/Toggle/GlobalStyleThemeMode';

import { lightTheme, darkTheme } from "views/components/Toggle/Themes"

// import { stopSongz, pauseSongz, resumeSongz, audioControlz } from './control';

import TwitchAuthCallback from "views/pages/Auth/TwitchAuthCallback";

// YouTube-Clone
import Sidebar from "views/components/Sidebar";
// import Navbar from "views/components/Navbar";

// CORE
import { playSong, stopSong, pauseSong, resumeSong, } from 'core/actions/index';
import { fetchGenres, fetchOAuthUser } from "core/actions";
import { selectors } from "core/reducers/index";
import history  from "core/services/history";

// CONTEXT PRO
// import { AccountContextProvider } from 'views/pages/account/AccountContext';
import { TwitchContext, TwitchProvider } from 'views/pages/Auth/twitch/useToken';
import { GoogleContext, GoogleProvider } from 'views/pages/Auth/google/useToken';
import { SpotifyContext, SpotifyProvider } from 'views/pages/Auth/spotify/useToken';
import { MusicPlayerContext, MusicPlayerProvider } from 'views/components/context/MusicPlayerContext';

import { YoutubeContext, YoutubeProvider } from 'views/pages/Auth/youtube/useToken';

import useEventListenerMemo from 'core/hooks2/useEventListenerMemo';


const Wrapper = styled.div`
  height: 100%;
`;

const Wrapperz = styled.div`
  /* position: fixed; */
`;

const Main = styled.div`
  max-width: ${maxWidthContent}px;
  background: #0f0f0f;
  margin: 0 auto;
  width: 100%;
  /* height: 100%; */
  top: 0;
`;

const Content = styled.div`
  margin-top: 15px;
  margin-top: -15px;
  padding: 0px 16px;
`;

const LeftSide = styled.div`
  width: 20%;
  /* position: relative; */
  /* position: fixed; */
  top: 10px;
  left: 10px;
  bottom: 10px;
  width: 180px;
  overflow-y: auto;
  display: table;
`;

const StyledWrapper = styled.div`

`;

const ModalContext = React.createContext();

function Modal({ children, onModalClose }) {
  // ESCAPE BUTTON

  // React.useEffect(() => {
  //   function keyListener(e) {
  //     const listener = keyListenersMap.get(e.keyCode);
  //     return listener && listener(e);
  //   }
  //   document.addEventListener("keydown", keyListener);
  //
  //   return () => document.removeEventListener("keydown", keyListener);
  // });

  const modalRef = React.createRef();

  const handleTabKey = e => {
    const focusableModalElements = modalRef.current.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstElement = focusableModalElements[0];
    const lastElement = focusableModalElements[focusableModalElements.length - 1];

    if (!e.shiftKey && document.activeElement !== firstElement) {
      firstElement.focus();
      return e.preventDefault();
    }

    if (e.shiftKey && document.activeElement !== lastElement) {
      lastElement.focus();
      e.preventDefault();
    }

    if (e.shiftKey && e.key === 'Tab') {
      e.preventDefault();
      setIsModalVisible(true)
    }
  };

  const keyListenersMap = new Map([
    [27, onModalClose],
    [9, handleTabKey],
    // [],
    // []
  ]);

  return ReactDOM.createPortal(
    <div className="AYOO">

      <div className="modal-content-1" ref={modalRef}>
        <ModalContext.Provider value={{ onModalClose }}>
          {children}
        </ModalContext.Provider>
      </div>
      <div className="modal-content-2" ref={modalRef}>
        <ModalContext.Provider value={{ onModalClose }}>
          <Modal.Header>Feed</Modal.Header>
          <Modal.Body>Pitchfork</Modal.Body>

        </ModalContext.Provider>
      </div>
      <div className="modal-content-3" ref={modalRef}>
        <ModalContext.Provider value={{ onModalClose }}>
          <Modal.Header>Music Player</Modal.Header>
          <Modal.Body>Pitchfork</Modal.Body>

        </ModalContext.Provider>
      </div>

      <div className="modal-container" role="dialog" aria-modal="true">

      </div>

    </div>,
    document.body
  );
}

Modal.Header = function ModalHeader(props) {
  const { onModalClose } = React.useContext(ModalContext);

  return (
    <div className="modal-header">
      {props.children}
      {/*<button className="cross-btn" title="close modal" onClick={onModalClose}>
        ✕
      </button>*/}
    </div>
  );
};

Modal.Body = function ModalBody(props) {
  return <div className="modal-body">{props.children}</div>;
};

Modal.Footer = function ModalFooter(props) {
  return <div className="modal-footer">{props.children}</div>;
};

Modal.Footer.CloseBtn = function CloseBtn(props) {
  const { onModalClose } = React.useContext(ModalContext);
  return (
    <button
      {...props}
      className="close-btn"
      title="close modal"
      onClick={onModalClose}
    />
  );
};

const AppRoutesContainer = () => {
  return (
    <React.StrictMode>
    <RecoilRoot>

          {/*<AccountContextProvider>*/}
            {/*<TwitchProvider>*/}
              {/*<GoogleProvider>
                <MusicPlayerProvider>*/}

                  <App />

                {/*</MusicPlayerProvider>
              </GoogleProvider>*/}
            {/*</TwitchProvider>*/}
          {/*</AccountContextProvider>*/}

    </RecoilRoot>
    </React.StrictMode>
  );
};

const App = () => {

  let audio;
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  // const isFetching = useSelector(state => selectors.selectIsFetchingGenres(state));
  // const genres = useSelector(state => selectors.selectGenres(state));
  // const genresCount = Object.keys(genres).length;

  // OVERLAY
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const keys = ['Shift', 'Tab']
  const counter_strike = ['B']

  useEffect(() => {
    if (isModalVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalVisible]);

  const handleKeyboardShortcut = useCallback(keys => { setIsModalVisible(currentShowImage => !currentShowImage)}, [setIsModalVisible])
  useKeyboardShortcut(
    keys,
    handleKeyboardShortcut,
    {
      overrideSystem: true,
      ignoreInputFields: false,
      repeatOnHold: false
    }
  )
  // useKeyboardShortcut(
  //   counter_strike,
  //   handleKeyboardShortcut,
  //   {
  //     overrideSystem: true,
  //     ignoreInputFields: false,
  //     repeatOnHold: false
  //   }
  // )

  // useEffect(() => {
  //   dispatch(fetchGenres());
  //
  // }, [dispatch]);



  const { stopSongz, pauseSongz, resumeSongz, audioControlz } = useContext(MusicPlayerContext) || {};
  const { setTwitchAccessToken, setTwitchRefreshToken, setTwitchUserId, setTwitchUsername, setTwitchProfileImage } = useContext(TwitchContext) || {};
  const { setGoogleAccessToken, setGoogleRefreshToken, setGoogleUsername, setGoogleProfileImage } = useContext(GoogleContext) || {};
  const { setSpotifyAccessToken, setSpotifyRefreshToken, setSpotifyUsername, setSpotifyProfileImage } = useContext(SpotifyContext) || {};
  // const { setUnsplashAccessToken, setUnsplashRefreshToken, setUnsplashUsername, setUnsplashProfileImage } = useContext(UnsplashContext) || {};
  // const { setYoutubeAccessToken, setYoutubeRefreshToken, setYoutubeUsername, setYoutubeProfileImage } = useContext(YoutubeContext) || {};

  const [childMessage, setChildMessage] = useState("");
  useEventListenerMemo('message', receiveMessage, window, true, { capture: false });
  // useEventListenerMemo('message', receiveMessage2, window, true, { capture: false });

  // window.addEventListener('keydown', function(e) {
  //   if(e.keyCode == 32 && e.target == document.body) {
  //     e.preventDefault();
  //   }
  // });

  function receiveMessage(e) {
    if (e.origin.startsWith('http://localhost:3001') && e.data?.access_token && e.data?.service) {
      if (e.data.service === 'twitch') {
        console.log("Receive postMessage TOKEN");
        console.log(e.data);
        // if (setTwitchAccessToken) setTwitchAccessToken(e.data.access_token);
        // if (setTwitchRefreshToken) setTwitchRefreshToken(e.data.refresh_token);
        // if (setTwitchUsername) setTwitchUsername(e.data.username);
        // if (setTwitchUserId) setTwitchUserId(e.data.userId);
        // if (setTwitchProfileImage) setTwitchProfileImage(e.data.profileImg);
        setChildMessage(e.data.profileImg);
        // RELOAD

        // // redux-saga
        // store.dispatch(receiveOpenerPostMessageData(event.data));
        // dispatch(receiveOpenerPostMessageData(event.data));
        dispatch(fetchOAuthUser(event.data));

        history.push('/');
      } else if (e.data.service === 'google') {
        if (e.data.access_token && setGoogleAccessToken) setGoogleAccessToken(e.data.access_token);
        if (e.data.username && setGoogleUsername) setGoogleUsername(e.data.username);
        if (e.data.profileImg && setGoogleProfileImage) setGoogleProfileImage(e.data.profileImg);

        dispatch(fetchOAuthUser(event.data));

        // toggleEnabled('youtube', true);
      } else if (e.data.service === 'spotify') {
        if (e.data.access_token && setSpotifyAccessToken) setSpotifyAccessToken(e.data.access_token);
        if (e.data.username && setSpotifyUsername) setSpotifyUsername(e.data.username);
        if (e.data.profileImg && setSpotifyProfileImage) setGoogleProfileImage(e.data.profileImg);
        // toggleEnabled('youtube', true);
      }
    }
  }


  const [theme, themeToggler, mountedComponent] = useThemeMode();
  const themeMode = theme === 'light' ? lightTheme : darkTheme;

  const showChatList = pathname.startsWith('/chat');
  return (
    <ThemeProvider theme={themeMode}>
      <>
      {/*<GlobalStyle />*/}
      <GlobalStyleThemeMode />
      <StyledWrapper>
      {/*<React.Fragment>*/}
        {/*<Route path="/login" component={LoginPage} />*/}


        {/*<RecoilRoot>*/}


        {/*<AccountProvider>
          <TwitchProvider>
            <GoogleProvider>
              <MusicPlayerProvider>*/}
        {(pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/auth/twitch/callback' || pathname === '/auth/google/callback') ? null : (
          <AppHeader
            imgSrc={childMessage}
            themeToggler={themeToggler}
            themez={theme}
            >
            <Toggle theme={theme} toggleTheme={themeToggler} />
          </AppHeader>
        )}

        {/*<AppDrawer />*/}

        {/*REFERENCE*/}
        {/*/Users/driptamine/Desktop/frontend/Spotify/react-spotify-pau1fitz/src/App.js*/}

        {/*<LeftSide className="left-side-section">
          <Wrapperz>
            <SideMenu />
            <UserPlaylists />
          </Wrapperz>
        </LeftSide>*/}

        {(pathname === '/' || pathname === '/login' || pathname === '/signup') ? null : (<Sidebar />)}


        {(pathname === '/' || pathname === '/login' || pathname === '/signup') ? (
          <div>
          {/*<SidebarContainer>*/}
            {/*<Route path="auth/twitch/callback" element={<TwitchAuthCallback />} />*/}

            <ModalRoutes
              // stopSong={stopSong}
              // pauseSong={pauseSong}
              // resumeSong={resumeSong}
              // audioControl={audioControl}

              stopSong={stopSongz}
              pauseSong={pauseSongz}
              resumeSong={resumeSongz}
              audioControl={audioControlz}
              // videoControl={videoControlz}
            />
            {/*<LegacyRoutes />*/}
          {/*</SidebarContainer>*/}
          </div>
        ) : (showChatList) ? (


            <Container gotsidebar={true} >
            <div style={{'display': 'flex'}}>
            <ModalRoutes
              // stopSong={stopSong}
              // pauseSong={pauseSong}
              // resumeSong={resumeSong}
              // audioControl={audioControl}

              stopSong={stopSongz}
              pauseSong={pauseSongz}
              resumeSong={resumeSongz}
              audioControl={audioControlz}
              // videoControl={videoControlz}
            />
            </div>
            </Container>


        ) : (
          <Container gotsidebar={true} >

            {/*<Route path="auth/twitch/callback" element={<TwitchAuthCallback />} />*/}

            <ModalRoutes
              // stopSong={stopSong}
              // pauseSong={pauseSong}
              // resumeSong={resumeSong}
              // audioControl={audioControl}

              stopSong={stopSongz}
              pauseSong={pauseSongz}
              resumeSong={resumeSongz}
              audioControl={audioControlz}
              // videoControl={videoControlz}
            />
            {/*<LegacyRoutes />*/}
          </Container>
        )}



        {/*REFERENCE pau1fitz/react-spotify-master*/}

        {/*{(pathname === '/login' && '/signup') ? null : (
          <Footer
            stopSong={stopSongz}
            pauseSong={pauseSongz}
            resumeSong={resumeSongz}
            audioControl={audioControlz}
          />
        )}*/}

        {/*<Player />*/}

        {/*<BackToTopButton />*/}

        {/*</YoutubeProvider>*/}

          {/*</MusicPlayerProvider>
          </GoogleProvider>
          </TwitchProvider>
          </AccountProvider>*/}
        {/*</RecoilRoot>*/}
      {/*</React.Fragment>*/}
      </StyledWrapper>

      {isModalVisible && (
        <div>
          <Modal onModalClose={() => setIsModalVisible(false)}>
            <Modal.Header>Chat</Modal.Header>
            <Modal.Body>Online</Modal.Body>
            <Modal.Footer>
              Group Chats
              {/*<Modal.Footer.CloseBtn>Close</Modal.Footer.CloseBtn>*/}
            </Modal.Footer>
          </Modal>

        {/*<Modal onModalClose={() => setIsModalVisible(false)}>
        </Modal>*/}
        </div>
      )}
      </>
    </ThemeProvider>
  );
}


// App.audio = {};
// App.audio = ({ }) => {
//
// }

// export default connect(null, {
//   // playSong,
//   // stopSong,
//   // pauseSong,
//   // resumeSong,
//
//   playSong: playSong,
//   stopSong: stopSong,
//   pauseSong: pauseSong,
//   resumeSong: resumeSong,
// })(App);

// const mapDispatchToProps = (dispatch) => {
//   return bindActionCreators(
//     {
//       // fetchUser,
//       // setToken,
//       playSong,
//       stopSong,
//       pauseSong,
//       resumeSong,
//     },
//     dispatch
//   );
// };

// export default connect(
//   null,
//   {
//     playSongzz: playSong,
//     stopSong: stopSong,
//     pauseSongzz: pauseSong,
//     resumeSong: resumeSong,
//   }
// )(App);

// export default connect(
//   null,
//   mapDispatchToProps
// )(App);
// export default App;

export default AppRoutesContainer;
// export default App;
