import React, { useEffect, useContext, useLocation } from "react";
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';
import { connect, useDispatch, useSelector } from "react-redux";
import { RecoilRoot } from 'recoil';
import styled from 'styled-components';

// MATERIAL DONE
// import { Container } from "@mui/material";
// import { makeStyles } from "@mui/material/styles";

// VIEWS
import LoginPage from "views/pages/LoginPage";
import Container from "views/styles/Container";
import Routes from "views/components/Routes";
import ModalRoutes from "views/components/ModalRoutes";
import LoadingIndicator from "views/components/LoadingIndicator";
import AppHeader from "views/components/AppHeader";
import AppDrawer from "views/components/AppDrawer";
import BackToTopButton from "views/components/BackToTopButton";
import Player from "views/components/player/Player";
import SideMenu from "views/components/SideMenu";
import UserPlaylists from "views/components/UserPlaylists";
import Footer from 'views/components/footer/Footer';
import { maxWidthContent } from 'views/style/util';
// import { stopSongz, pauseSongz, resumeSongz, audioControlz } from './control';

import TwitchAuthCallback from "views/pages/Auth/TwitchAuthCallback";
// YouTube-Clone
import Sidebar from "views/components/Sidebar";
// import Navbar from "views/components/Navbar";


// CORE
import { playSong, stopSong, pauseSong, resumeSong, } from 'core/actions/index';
import { fetchGenres } from "core/actions";
import { selectors } from "core/reducers/index";
import history  from "core/services/history";

// CONTEXT PRO
import { TwitchContext, TwitchProvider } from 'views/pages/Auth/twitch/useToken';
import { YoutubeContext, YoutubeProvider } from 'views/pages/Auth/youtube/useToken';
import { GoogleContext, GoogleProvider } from 'views/pages/Auth/google/useToken';
import { SpotifyContext, SpotifyProvider } from 'views/pages/Auth/spotify/useToken';


import useEventListenerMemo from 'core/hooks2/useEventListenerMemo';


// const useStyles = makeStyles(theme => ({
//   toolbar: theme.mixins.toolbar,
//   root: {
//     backgroundColor: '#161616',
//   },
//   main: {
//     // padding: theme.spacing(2),
//     // paddingTop: "55px",
//     paddingTop: "3em",
//
//     paddingRight: "16px",
//     paddingBottom: "16px",
//     paddingLeft: "16px",
//     backgroundColor: '#161616',
//     maxWidth: "2560px",
//   },
//   test: {
//     minHeight: '48px',
//     height: '48px',
//     backgroundColor: '#161616'
//   },
//   arde: {
//     backgroundColor: '#161616'
//   }
// }));

const Wrapper = styled.div`
  height: 100%;
`;

const Wrapperz = styled.div`
  /* position: fixed; */
`;

const Modalz = styled.div`

`;

const Main = styled.div`
  max-width: ${`${maxWidthContent}px`};
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

function App({ stopSong, pauseSongzz, playSongzz, resumeSong }) {
  let audio;
  const dispatch = useDispatch();
  // const classes = useStyles();
  const isFetching = useSelector(state => selectors.selectIsFetchingGenres(state));
  const genres = useSelector(state => selectors.selectGenres(state));
  // const genresCount = Object.keys(genres).length;

  useEffect(() => {
    dispatch(fetchGenres());

  }, [dispatch]);





  // ORIGINAL


  const { setTwitchAccessToken, setTwitchRefreshToken, setTwitchUserId, setTwitchUsername, setTwitchProfileImage, } = useContext(TwitchContext) || {};
  const { setYoutubeAccessToken, setYoutubeRefreshToken, setYoutubeUsername, setYoutubeProfileImage } = useContext(YoutubeContext) || {};
  const { setGoogleAccessToken, setGoogleRefreshToken, setGoogleUsername, setGoogleProfileImage } = useContext(GoogleContext) || {};
  const { setSpotifyAccessToken, setSpotifyRefreshToken, setSpotifyUsername, setSpotifyProfileImage } = useContext(SpotifyContext) || {};
  // const { setUnsplashAccessToken, setUnsplashRefreshToken, setUnsplashUsername, setUnsplashProfileImage } = useContext(UnsplashContext) || {};

  useEventListenerMemo('message', receiveMessage, window, true, { capture: false });
  // useEventListenerMemo('message', receiveMessage2, window, true, { capture: false });

  window.addEventListener('keydown', function(e) {
    if(e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }
  });

  function receiveMessage(e) {
    if (e.origin.startsWith('http://localhost:3001') && e.data?.access_token && e.data?.service) {
      if (e.data.service === 'twitch') {
        console.log("Receive postMessage TOKEN");
        console.log(e.data);
        if (setTwitchAccessToken) setTwitchAccessToken(e.data.access_token);
        if (setTwitchRefreshToken) setTwitchRefreshToken(e.data.refresh_token);
        if (setTwitchUsername) setTwitchUsername(e.data.username);
        if (setTwitchUserId) setTwitchUserId(e.data.userId);
        if (setTwitchProfileImage) setTwitchProfileImage(e.data.profileImg);
        // RELOAD
        history.push('/');
        // window.location.replace("http://localhost:3001/");
        // toggleEnabled('twitch', true);
      } else if (e.data.service === 'youtube') {
        if (e.data.access_token && setYoutubeAccessToken) setYoutubeAccessToken(e.data.token);
        if (e.data.username && setYoutubeUsername) setYoutubeUsername(e.data.username);
        if (e.data.profileImg && setYoutubeProfileImage) setYoutubeProfileImage(e.data.profileImg);
        // toggleEnabled('youtube', true);
      } else if (e.data.service === 'google') {
        if (e.data.access_token && setGoogleAccessToken) setGoogleAccessToken(e.data.access_token);
        if (e.data.username && setGoogleUsername) setGoogleUsername(e.data.username);
        if (e.data.profileImg && setGoogleProfileImage) setGoogleProfileImage(e.data.profileImg);
        // toggleEnabled('youtube', true);
      } else if (e.data.service === 'spotify') {
        if (e.data.access_token && setSpotifyAccessToken) setSpotifyAccessToken(e.data.access_token);
        if (e.data.username && setSpotifyUsername) setSpotifyUsername(e.data.username);
        if (e.data.profileImg && setSpotifyProfileImage) setGoogleProfileImage(e.data.profileImg);
        // toggleEnabled('youtube', true);
      }
      // else if (e.data.service === 'unsplash') {
      //   if (e.data.access_token && setUnsplashAccessToken) setUnsplashAccessToken(e.data.access_token);
      //   if (e.data.username && setUnsplashUsername) setUnsplashUsername(e.data.username);
      //   if (e.data.profileImg && setUnsplashProfileImage) setUnsplashProfileImage(e.data.profileImg);
      //   // toggleEnabled('youtube', true);
      //   history.push('/feed?service=unsplash');
      // }
    }
  }

  const login_url = window.location.pathname;

  return (
    <>
    <React.Fragment>
      {/*<Route path="/login" component={LoginPage} />*/}
      <RecoilRoot>
        {/*<TwitchProvider>*/}
          {/*<YoutubeProvider>*/}
            {/*<AppHeader />*/}
            {/*{!(pathname === '/login') && (<AppHeader />)}*/}
            {/*{!(pathname === '/login') ? null : (<AppHeader />)}*/}
            {(login_url === '/login') ? null : (<AppHeader />)}
            <AppDrawer />
            {/*<div className={classes.test} />*/}

            {/*REFERENCE*/}
            {/*/Users/driptamine/Desktop/frontend/Spotify/react-spotify-pau1fitz/src/App.js*/}

            {/*<LeftSide className="left-side-section">
              <Wrapperz>
                <SideMenu />
                <UserPlaylists />
              </Wrapperz>
            </LeftSide>*/}
            {(login_url === '/login') ? null : (<Sidebar />)}

            <Container
              // className={classes.main}
              >
               {/*<LoadingIndicator loading={isFetching }>*/}
                  {/*<Routes />*/}
                  {/*<Route path="auth/twitch/callback" element={<TwitchAuthCallback />} />*/}

                  <ModalRoutes
                    stopSong={stopSongz}
                    pauseSong={pauseSongz}
                    resumeSong={resumeSongz}
                    audioControl={audioControlz}
                    // videoControl={videoControlz}
                  />

                  {/*REFERENCE pau1fitz/react-spotify-master*/}
                  <Footer
                    stopSong={stopSongz}
                    pauseSong={pauseSongz}
                    resumeSong={resumeSongz}
                    audioControl={audioControlz}
                  />
               {/*</LoadingIndicator>*/}

            </Container>

            {/*<Player />*/}
            {/*<BackToTopButton />*/}

          {/*</YoutubeProvider>*/}
        {/*</TwitchProvider>*/}

      </RecoilRoot>
    </React.Fragment>
    </>
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

export default connect(
  null,
  {
    playSongzz: playSong,
    stopSong: stopSong,
    pauseSongzz: pauseSong,
    resumeSong: resumeSong,
  }
)(App);
// export default connect(
//   null,
//   mapDispatchToProps
// )(App);
// export default App;
