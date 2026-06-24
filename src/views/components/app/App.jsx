import React, { useEffect, useContext, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import { Route, useLocation, Link } from 'react-router-dom';
import ModalLink from 'views/components/ModalLink';
import { useDispatch, useSelector } from 'react-redux';
import { RecoilRoot } from 'recoil';
import { styled } from '@linaria/react';
import { FRONTEND_CALLBACK_URL } from 'core/constants/urls';
import { FaPlus } from 'react-icons/fa';

import { useThemeMode } from 'views/components/Toggle/useThemeMode'
import useKeyboardShortcut from 'use-keyboard-shortcut';
import 'views/components/app/index.css';
import 'views/styles/theme-vars.css';

import BaseContainer from 'views/styles/BaseContainer';
import ModalRoutes from 'views/components/ModalRoutes';
import AppHeader from 'views/components/AppHeader';
import Toggle from 'views/components/Toggle/Toggler';
import GlobalStyleThemeMode from 'views/styles/GlobalStyleThemeMode';
import { lightTheme, darkTheme } from 'views/components/Toggle/Themes'

import Sidebar from 'views/components/Sidebar';
import BottomNavbar from 'views/components/Navbar/BottomNavbar';

import {
  fetchOAuthUser, fetchCurrentUser, setAccessToken
} from 'core/actions';
import { getAuthTokensFromCookies, saveAuthCookies } from 'core/utils/authCookies';
import useSelectAuthUser from 'core/hooks/useSelectAuthUser';
import { GoogleContext } from 'views/pages/Auth/google/useToken';
import { VkContext } from 'views/pages/Auth/vk/useToken';
import { MusicPlayerContext } from 'views/components/context/MusicPlayerContext';
import useEventListenerMemo from 'core/hooks2/useEventListenerMemo';
import useDetectMobile from 'core/hooks/useDetectMobile';
import { NotificationProvider } from 'core/context/NotificationContext';

const ModalContext = React.createContext();

function Modal({ children, onModalClose }) {
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
      <div className="modal-container" role="dialog" aria-modal="true"></div>
    </div>,
    document.body
  );
}

Modal.Header = function ModalHeader(props) {
  return (
    <div className="modal-header">
      {props.children}
    </div>
  );
};

Modal.Body = function ModalBody(props) {
  return <div className="modal-body">{props.children}</div>;
};

Modal.Footer = function ModalFooter(props) {
  return <div className="modal-footer">{props.children}</div>;
};

const AppRoutesContainer = () => {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </React.StrictMode>
  );
};

const App = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const keys = ['Shift', 'Tab'];

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
    setIsModalVisible(currentShowImage => !currentShowImage)
  }, [setIsModalVisible])

  useKeyboardShortcut(
    keys,
    handleKeyboardShortcut,
    {
      overrideSystem: true,
      ignoreInputFields: false,
      repeatOnHold: false
    }
  )

  const { stopSongz, pauseSongz, resumeSongz, audioControlz } = useContext(MusicPlayerContext) || {};
  const {
    setGoogleAccessToken, setGoogleRefreshToken, setGoogleUsername,
    setGoogleProfileImage, setGoogleEmail, setGoogleUserId
  } = useContext(GoogleContext) || {};
  const {
    setVkAccessToken, setVkRefreshToken, setVkUsername,
    setVkProfileImage, setVkEmail, setVkUserId
  } = useContext(VkContext) || {};

  const [childMessage, setChildMessage] = useState("");
  const user = useSelector(state => state.users) || {};
  useEventListenerMemo('message', receiveMessage, window, true, { capture: false });

  function receiveMessage(e) {
    if (e.origin.startsWith(`${FRONTEND_CALLBACK_URL}`) && e.data?.access_token && e.data?.service) {
      const { service, access_token, refresh_token, username, userId, email } = e.data;
      const profileImg = e.data.profileImg || e.data.profile_img || e.data.picture || e.data.avatar_url || e.data.avatar;

      if (service === 'google') {
        if (access_token && setGoogleAccessToken) setGoogleAccessToken(access_token);
        if (refresh_token && setGoogleRefreshToken) setGoogleRefreshToken(refresh_token);
        if (username && setGoogleUsername) setGoogleUsername(username);
        if (profileImg && setGoogleProfileImage) setGoogleProfileImage(profileImg);
        if (email && setGoogleEmail) setGoogleEmail(email);
        if (userId && setGoogleUserId) setGoogleUserId(userId);

        setChildMessage(profileImg);

        dispatch(fetchOAuthUser({ ...e.data, profileImg }));
        dispatch(fetchCurrentUser());
        saveAuthCookies(e.data);
      } else if (service === 'vk') {
        if (access_token && setVkAccessToken) setVkAccessToken(access_token);
        if (refresh_token && setVkRefreshToken) setVkRefreshToken(refresh_token);
        if (username && setVkUsername) setVkUsername(username);
        if (profileImg && setVkProfileImage) setVkProfileImage(profileImg);
        if (email && setVkEmail) setVkEmail(email);
        if (userId && setVkUserId) setVkUserId(userId);

        setChildMessage(profileImg);

        dispatch(fetchOAuthUser({ ...e.data, profileImg }));
        dispatch(fetchCurrentUser());
        saveAuthCookies(e.data);
      }
    }
  }

  const { isSignedIn } = useSelectAuthUser();

  useEffect(() => {
    if (!isSignedIn) {
      const tokens = getAuthTokensFromCookies();
      if (tokens?.access_token) {
        dispatch(setAccessToken(tokens));
        dispatch(fetchCurrentUser());
      }
    }
  }, []);

  const [theme, themeToggler] = useThemeMode();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const themeMode = theme === 'light' ? lightTheme : darkTheme;
  const isMobile = useDetectMobile();
  const showChatList = pathname.startsWith('/chat');
  const isAuthPage = pathname === '/' || pathname === '/login' || pathname === '/signup';
  const showBottomNav = isMobile && !isAuthPage;

  return (
    <>
      <>
      <GlobalStyleThemeMode />
      <NotificationProvider>
      <StyledWrapper isMobile={isMobile} showBottomNav={showBottomNav}>
        {(!isAuthPage && pathname !== '/auth/google/callback') && (
          <AppHeader
            imgSrc={childMessage || user.profileImg}
            themeToggler={themeToggler}
            themez={theme}
            >
            <Toggle theme={theme} toggleTheme={themeToggler} />
          </AppHeader>
        )}

        {isAuthPage ? (
          <WrapperContainer id='Wrapper'>
            <ModalRoutes
              stopSong={stopSongz}
              pauseSong={pauseSongz}
              resumeSong={resumeSongz}
              audioControl={audioControlz}
            />
          </WrapperContainer>
        ) : (
          <ContentWrapper>
            {!isMobile && <Sidebar />}
            {showChatList ? (
              <BaseContainer isChat={true} >
                <ChatFlexWrapper>
                  <ModalRoutes
                    stopSong={stopSongz}
                    pauseSong={pauseSongz}
                    resumeSong={resumeSongz}
                    audioControl={audioControlz}
                  />
                </ChatFlexWrapper>
              </BaseContainer>
            ) : (
              <BaseContainer>
                <ModalRoutes
                  stopSong={stopSongz}
                  pauseSong={pauseSongz}
                  resumeSong={resumeSongz}
                  audioControl={audioControlz}
                />
              </BaseContainer>
            )}
          </ContentWrapper>
        )}

        {showBottomNav && <BottomNavbar />}
        {isMobile ? (
          <CreateButton to="/create_post">
            <FaPlus size={22} />
          </CreateButton>
        ) : (
          <CreateBtnModal to="/create_post">
            <FaPlus size={22} />
          </CreateBtnModal>
        )}
      </StyledWrapper>
      </NotificationProvider>

      {isModalVisible && (
        <Modal onModalClose={() => setIsModalVisible(false)}>
          <Modal.Header>Chat</Modal.Header>
          <Modal.Body>Online</Modal.Body>
          <Modal.Footer>Group Chats</Modal.Footer>
        </Modal>
      )}
      </>
    </>
  );
}

const WrapperContainer = styled.div`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
`;

const ChatFlexWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding-left: 240px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding-left: 0;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-height: 0;
  padding-top: 5em;

  @media screen and (max-width: 768px) {
    padding-top: 70px;
  }
`;

const styledWrapperStyles = props => `
  padding-bottom: ${props.showBottomNav ? '60px' : '0'};
`;

const StyledWrapper = styled.div`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  ${styledWrapperStyles}
  display: flex;
  flex-direction: column;
`;

const btnStyles = `
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 1001;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #1d9bf0;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(29, 155, 240, 0.4);
  transition: transform 0.2s, background 0.2s;

  &:hover {
    background: #1a8cd8;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CreateButton = styled(Link)`${btnStyles}`;
const CreateBtnModal = styled(ModalLink)`${btnStyles}`;

export default AppRoutesContainer;
