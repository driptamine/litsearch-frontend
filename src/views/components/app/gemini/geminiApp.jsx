import React, { useEffect, useContext, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import useKeyboardShortcut from 'use-keyboard-shortcut';

// VIEWS
import LoginPage from 'views/pages/LoginPage'; // Keep for conditional rendering
import Container from 'views/pages/LoginPage';
import ModalRoutes from 'views/pages/LoginPage';
import AppHeader from 'views/pages/LoginPage';
import Sidebar from 'views/pages/LoginPage';
import Toggle from 'views/components/Toggle/Toggler';

// STYLES
import GlobalStyleThemeMode from 'views/styles/GlobalStyleThemeMode';
import { lightTheme, darkTheme } from 'views/pages/LoginPage';
import { useThemeMode } from 'views/pages/LoginPage';
import { maxWidthContent } from 'views/style/util';
import 'views/components/app/index.css'; // Global CSS

// CORE
import { fetchOAuthUser } from 'views/pages/LoginPage'; // Corrected import
import history from 'views/pages/LoginPage';
import useEventListenerMemo from 'core/hooks2/useEventListenerMemo';

// CONTEXTS
// Import these only if you are using them in App.jsx directly.
// Otherwise, they should be consumed by specific components, or centralized in AppProviders.
import { MusicPlayerContext } from 'views/components/context/MusicPlayerContext';
import { TwitchContext } from 'views/pages/Auth/twitch/useToken';
import { GoogleContext } from 'views/pages/Auth/google/useToken';
import { SpotifyContext } from 'views/pages/Auth/spotify/useToken';
// import { YoutubeContext } from 'views/pages/Auth/youtube/useToken'; // If used

// EXTRACTED COMPONENTS
import Modal from 'views/pages/LoginPage';
import AppProviders from 'views/pages/LoginPage';


const App = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  // Theme Mode
  const [theme, themeToggler, mountedComponent] = useThemeMode();
  const themeMode = theme === 'light' ? lightTheme : darkTheme;

  // Modal State for Chat
  const [isModalVisible, setIsModalVisible] = useState(false);
  const shortcutKeys = ['Shift', 'Tab'];

  // Contexts (ensure these are provided by an ancestor if uncommented)
  const musicPlayerContext = useContext(MusicPlayerContext) || {};
  const twitchContext = useContext(TwitchContext) || {};
  const googleContext = useContext(GoogleContext) || {};
  const spotifyContext = useContext(SpotifyContext) || {};
  // const youtubeContext = useContext(YoutubeContext) || {}; // If used

  const { stopSongz, pauseSongz, resumeSongz, audioControlz } = musicPlayerContext;
  const { setTwitchAccessToken, setTwitchRefreshToken, setTwitchUserId, setTwitchUsername, setTwitchProfileImage } = twitchContext;
  const { setGoogleAccessToken, setGoogleRefreshToken, setGoogleUsername, setGoogleProfileImage } = googleContext;
  const { setSpotifyAccessToken, setSpotifyRefreshToken, setSpotifyUsername, setSpotifyProfileImage } = spotifyContext;

  const [childMessage, setChildMessage] = useState("");

  // Effects
  useEffect(() => {
    document.body.style.overflow = isModalVisible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalVisible]);

  useEffect(() => {
    const preventDefault = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", preventDefault);

    return () => {
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", preventDefault);
    };
  }, []);

  const handleKeyboardShortcut = useCallback(() => {
    setIsModalVisible(currentShowImage => !currentShowImage);
  }, []);

  useKeyboardShortcut(
    shortcutKeys,
    handleKeyboardShortcut,
    {
      overrideSystem: true,
      ignoreInputFields: false,
      repeatOnHold: false
    }
  );

  const receiveMessage = useCallback((e) => {
    if (e.origin.startsWith('http://localhost:3001') && e.data?.access_token && e.data?.service) {
      const { access_token, refresh_token, username, userId, profileImg, service } = e.data;

      switch (service) {
        case 'twitch':
          // console.log("Receive postMessage TOKEN", e.data);
          if (setTwitchAccessToken) setTwitchAccessToken(access_token);
          if (setTwitchRefreshToken) setTwitchRefreshToken(refresh_token);
          if (setTwitchUsername) setTwitchUsername(username);
          if (setTwitchUserId) setTwitchUserId(userId);
          if (setTwitchProfileImage) setTwitchProfileImage(profileImg);
          setChildMessage(profileImg);
          dispatch(fetchOAuthUser(e.data)); // Use e.data directly
          history.push('/');
          break;
        case 'google':
          if (setGoogleAccessToken) setGoogleAccessToken(access_token);
          if (setGoogleUsername) setGoogleUsername(username);
          if (setGoogleProfileImage) setGoogleProfileImage(profileImg);
          dispatch(fetchOAuthUser(e.data));
          break;
        case 'spotify':
          if (setSpotifyAccessToken) setSpotifyAccessToken(access_token);
          if (setSpotifyUsername) setSpotifyUsername(username);
          if (setSpotifyProfileImage) setSpotifyProfileImage(profileImg); // Note: Original had setGoogleProfileImage
          break;
        default:
          break;
      }
    }
  }, [
    dispatch, history,
    setGoogleAccessToken, setGoogleProfileImage, setGoogleUsername,
    setSpotifyAccessToken, setSpotifyProfileImage, setSpotifyUsername,
    setTwitchAccessToken, setTwitchProfileImage, setTwitchRefreshToken, setTwitchUserId, setTwitchUsername
  ]);

  useEventListenerMemo('message', receiveMessage, window, true, { capture: false });


  const showHeaderAndSidebar = !['/', '/login', '/signup', '/auth/twitch/callback', '/auth/google/callback'].includes(pathname);
  const showChatList = pathname.startsWith('/chat');
  const isLoginPage = pathname === '/' || pathname === '/login' || pathname === '/signup';

  return (
    <ThemeProvider theme={themeMode}>
      <>
        <GlobalStyleThemeMode />
        <StyledWrapper>
          {showHeaderAndSidebar && (
            <AppHeader imgSrc={childMessage} themeToggler={themeToggler} themez={theme}>
              <Toggle theme={theme} toggleTheme={themeToggler} />
            </AppHeader>
          )}

          {showHeaderAndSidebar && <Sidebar />}

          {/* Conditional rendering for main content area */}
          {isLoginPage ? (
            <ModalRoutes
              stopSong={stopSongz}
              pauseSong={pauseSongz}
              resumeSong={resumeSongz}
              audioControl={audioControlz}
            />
          ) : showChatList ? (
            <Container gotsidebar={true}>
              <div style={{ 'display': 'flex' }}>
                <ModalRoutes
                  stopSong={stopSongz}
                  pauseSong={pauseSongz}
                  resumeSong={resumeSongz}
                  audioControl={audioControlz}
                />
              </div>
            </Container>
          ) : (
            <Container gotsidebar={true}>
              <ModalRoutes
                stopSong={stopSongz}
                pauseSong={pauseSongz}
                resumeSong={resumeSongz}
                audioControl={audioControlz}
              />
            </Container>
          )}

          {isModalVisible && (
            <Modal onModalClose={() => setIsModalVisible(false)}>
              <Modal.Header>Chat</Modal.Header>
              <Modal.Body>Online</Modal.Body>
              <Modal.Footer>Group Chats</Modal.Footer>
            </Modal>
          )}
        </StyledWrapper>
      </>
    </ThemeProvider>
  );
};

// This component now solely provides the RecoilRoot and any other top-level providers.
const AppRoutesContainer = () => {
  return (
    <AppProviders>
      <App />
    </AppProviders>
  );
};


const StyledWrapper = styled.div``;

// Styled components for layout
const Main = styled.div`
  max-width: ${maxWidthContent}px;
  background: #0f0f0f;
  margin: 0 auto;
  width: 100%;
  top: 0;
`;

const Content = styled.div`
  margin-top: -15px;
  padding: 0px 16px;
`;

// Consider if LeftSide is still needed as Sidebar is used directly
// const LeftSide = styled.div`
//   width: 20%;
//   top: 10px;
//   left: 10px;
//   bottom: 10px;
//   width: 180px;
//   overflow-y: auto;
//   display: table;
// `;

export default AppRoutesContainer;
