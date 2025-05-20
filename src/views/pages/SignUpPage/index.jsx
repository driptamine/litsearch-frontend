
import React, { useState, useEffect, useContext } from 'react'
import { connect, useDispatch, useSelector} from 'react-redux';
import { Redirect, useHistory } from "react-router-dom";

// ICONS
import { FaTwitch } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaSpotify } from 'react-icons/fa';
import { FaApple } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaUnsplash } from 'react-icons/fa';
import { FaSoundcloud } from 'react-icons/fa';
import { FaDeezer } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
// import { styled as styledd }  from 'styled-components';
// import * as styledd from 'styled-components';
import styled from 'styled-components';


// MATERIAL DONE
// import { TextField, Container, Grid, Button } from "@mui/material";
import { StyledTextField, StyledContainer, StyledGrid, StyledButton } from 'views/styledComponents';

// VIEWS
// import FormControl from './FormControl'
import {
  twitchSignInAction, googleSignInAction, appleSignInAction,
  spotifySignInAction, unsplashSignInAction, deezerSignInAction, instagramSignInAction } from "views/pages/LoginPage/action"
import ReAuthenticateButton from 'views/pages/Auth/ReAuthenticateButton';
import disconnectYoutube from 'views/pages/Auth/youtube/disconnectYoutube';
import disconnectTwitch from 'views/pages/Auth/twitch/disconnectTwitch';

// CONTEXT PROVIDER
import { TwitchContext } from 'views/pages/Auth/twitch/useToken';
import { YoutubeContext } from 'views/pages/Auth/youtube/useToken';
import { SpotifyContext } from 'views/pages/Auth/spotify/useToken';
import { GoogleContext } from 'views/pages/Auth/google/useToken';

import litloopLogo from "views/assets/litloopLogo3.png";

// CORE
import history  from "core/services/history";
import { fetchAuthUser, fetchSignUpUser  } from 'core/actions'
import useHistoryPush from "core/hooks/useHistoryPush";
// import { selectAuth } from 'core/reducers/authSlice';
import { selectors } from "core/reducers/index";
import { feedPreferencesAtom, useFeedPreferences } from 'core/atoms/atoms';
import useEventListenerMemo from 'core/hooks2/useEventListenerMemo';


const ContainerStyled = styled.div`
  body {
    background: red;
  }
  margin-top: 2em;
  border: 4px solid black;
  border-radius: 11px;
  background-color: black;
  min-width: 300px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;


`;

const LitLoopDiv = styled.div`
  width: 80%;
  margin-left: auto;
  margin-right: auto;
`;

const FormStyled = styled.form`
  text-align: center;
  width: 80%;

  /* min-width: 280px;
  max-width: 300px; */

  min-width: 220px;
  max-width: 240px;

  margin-left: auto;
  margin-right: auto;


`;

const TextFieldStyledInput = styled.input`
  /* padding: 0 30px; */
  /* border: 4px solid #000; */
  border: 0;
  border-radius: 10px;
  padding: 15px;

  width: 100%;
  box-sizing: border-box;
`;

const LitLoopLogo = styled.img`
  width: 10%;
  height: 50%;

  display: block;
  margin-left: auto;
  margin-right: auto }
`;

const LitLoopTitle = styled.p`
  text-align: center;
  font-size: 27px;
  color: white;
  font-family: Verdana;
`;


const LoginBtn = styled.button`
  /* background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%); */
  background: linear-gradient(45deg, #673ab7 30%, #3f51b5 90%);
  border: 0;
  border-radius: 10px;

  /* box-shadow: 0 3px 5px 2px rgba(255, 105, 135, .3); */
  color: white;
  height: 45px;
  width: 100%;
  padding: 0 30px;
  cursor: pointer;
`;

const OAuthWrapper = styled.div`
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  min-width: 280px;
  max-width: 300px;
`;

const OAuthLoginButton = styled.button`
  cursor: pointer;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1em;
  margin-bottom: 1em;
  display: flex;
  /* height: 30px; */
  width: 66%;
  padding: 10px;
  border: 0;
  border-radius: 6px;
  grid-gap: 10px;
  gap: 10px;
`;

const FaSpotifyIcon = styled(FaSpotify)`
  color: #2fd566;

`
const FaSoundCloudIcon = styled(FaSoundcloud)`
  color: #f50;

`
const ReStyledGrid = styled(StyledGrid)`
  margin-bottom: 1em;

`

function SignUpForm () {
  const {
    setAutoRefreshEnabled,
    autoRefreshEnabled,
    twitchVideoHoverEnable,
    setTwitchVideoHoverEnable,
    isEnabledOfflineNotifications,
    setIsEnabledOfflineNotifications,
    isEnabledUpdateNotifications,
    setIsEnabledUpdateNotifications,
    setEnableVodVolumeOverlay,
    enableVodVolumeOverlay,
    setTwitchAccessToken,
    twitchAccessToken,
    setTwitchRefreshToken,
    setTwitchUsername,
    setTwitchUserId,
    setTwitchProfileImage
  } = useContext(TwitchContext) || {};
  const {
    youtubeVideoHoverEnable,
    setYoutubeVideoHoverEnable,
    setYoutubeAccessToken,
    youtubeAccessToken,
  } = useContext(YoutubeContext) || {};

  const { toggleEnabled, toggleSidebar } = useFeedPreferences();

  // const classes = useStyles();

  const dispatch = useDispatch()
  const historyPush = useHistoryPush();
  const historyPusha = useHistory();
  // const authSelector = useSelector(selectAuth);
  // const navigate = useNavigate();

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState(null)
  const [isError, setIsError] = useState(false);

  const [loginDetail, setLoginDetail] = useState({username: '', password: ''})

  // if (authSelector.authenticated) {
  //   return <Redirect to={"/"} />;
  //   // navigate("/")
  // }

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(fetchSignUpUser({
      email: email,
      username: username,
      password: password
    }))

    // window.location.replace("http://localhost:3001/");

  }

  async function handleTwitchButtonClick(e) {
    e.preventDefault();

    try {
      dispatch(twitchSignInAction());
    } catch (err) {
      console.log(err);
      setIsError(true);
    }
  }

  async function handleGoogleButtonClick(e) {
    e.preventDefault();

    try {
      dispatch(googleSignInAction());
    } catch (err) {
      console.log(err);
      setIsError(true);
    }
  }

  async function handleUnsplashButtonClick(e) {
    e.preventDefault();

    try {
      dispatch(unsplashSignInAction());
    } catch (err) {
      console.log(err);
      setIsError(true);
    }
  }

  async function handleAppleButtonClick(e) {
    e.preventDefault();

    try {
      dispatch(appleSignInAction());
    } catch (err) {
      console.log(err);
      setIsError(true);
    }
  }

  async function handleSpotifyButtonClick(e) {
    e.preventDefault();

    try {
      dispatch(spotifySignInAction());
    } catch (err) {
      console.log(err);
      setIsError(true);
    }
  }

  async function handleDeezerButtonClick(e) {
    e.preventDefault();

    try {
      dispatch(deezerSignInAction());
    } catch (err) {
      console.log(err);
      setIsError(true);
    }
  }
  async function handleInstagramButtonClick(e) {
    e.preventDefault();

    try {
      dispatch(instagramSignInAction());
    } catch (err) {
      console.log(err);
      setIsError(true);
    }
  }

  const isFetching = useSelector(state =>
    selectors.selectIsFetchingToken(state)
  );

  // useEffect(() => {
  //   dispatch(fetchAuthUser(email, password))
  // }, [dispatch, email, password])

  // render() {
      // const { data, errors } = this.state
  // const classes = useStyles();


  // const { setTwitchAccessToken, setTwitchRefreshToken, setTwitchUserId, setTwitchUsername, setTwitchProfileImage, } = useContext(TwitchContext) || {};
  // const { setYoutubeAccessToken, setYoutubeRefreshToken, setYoutubeUsername, setYoutubeProfileImage } = useContext(YoutubeContext) || {};
  const { setGoogleAccessToken, setGoogleRefreshToken, setGoogleUsername, setGoogleProfileImage } = useContext(GoogleContext) || {};
  const { setSpotifyAccessToken, setSpotifyRefreshToken, setSpotifyUsername, setSpotifyProfileImage } = useContext(SpotifyContext) || {};



  function receiveMessage(e) {
    if (e.origin.startsWith('http://localhost:3001') && e.data?.access_token && e.data?.service) {

      if (e.data.service === 'twitch') {
        console.log("Receive postMessage TWITCH TOKEN");
        console.log(e.data);
        if (setTwitchAccessToken) setTwitchAccessToken(e.data.access_token);
        if (setTwitchRefreshToken) setTwitchRefreshToken(e.data.refresh_token);
        if (setTwitchUsername) setTwitchUsername(e.data.username);
        if (setTwitchUserId) setTwitchUserId(e.data.userId);
        if (setTwitchProfileImage) setTwitchProfileImage(e.data.profileImg);
        // RELOAD
        history.push('/');
        // historyPusha.push('/');
        // window.location.replace("http://localhost:3001/");

      } else if (e.data.service === 'google') {
        console.log("Receive postMessage GOOGLE TOKEN");
        console.log(e.data);
        if (e.data.access_token && setGoogleAccessToken) setGoogleAccessToken(e.data.access_token);
        if (e.data.username && setGoogleUsername) setGoogleUsername(e.data.username);
        if (e.data.profileImg && setGoogleProfileImage) setGoogleProfileImage(e.data.profileImg);
        history.push('/');

      }

    }
  }

  useEventListenerMemo('message', receiveMessage, window, true, { capture: false });

  return (
    <ContainerStyled className={"container"} maxWidth="xs">
      <LitLoopDiv>
        <LitLoopLogo src={litloopLogo} />
        <LitLoopTitle>
          LitLoop
        </LitLoopTitle>
        <LitLoopTitle>
          Sign Up
        </LitLoopTitle>



      </LitLoopDiv>
      <FormStyled onSubmit={(e) => handleSubmit(e)}>
        <ReStyledGrid container
          spacing={3}
          // className={classes.test}
          >
          {/*// 1*/}
          <ReStyledGrid
            item xs={12}

          >
            <ReStyledGrid>
              <ReStyledGrid
                // class={classes.input}

                >
                <TextFieldStyledInput
                  // className={classes.input}
                  name="Email"
                  label="Email"
                  type="text"
                  value={email}
                  // handleChange={handleChange}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  inputProps={{
                    autoComplete: 'on'
                  }}
                    // error={username}
                  placeholder="Email"
                />
              </ReStyledGrid>
              <ReStyledGrid
                // class={classes.input}

                >
                <TextFieldStyledInput
                  // className={classes.input}
                  name="Username"
                  label="Username"
                  type="text"
                  value={username}
                  // handleChange={handleChange}
                  onChange={(e) => setUsername(e.target.value)}
                  variant="outlined"
                  inputProps={{
                    autoComplete: 'on'
                  }}
                  placeholder="Username"
                    // error={username}
                />
              </ReStyledGrid>
              <ReStyledGrid item
                // class={classes.input}
                >
                <TextFieldStyledInput
                  // className={classes.input}
                  name="Password"
                  label="Password"
                  type="password"
                  value={password}
                  // handleChange={handleChange}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  inputProps={{
                    autoComplete: 'on'
                  }}
                  placeholder="Password"
                    // error={errors.password}
                />
              </ReStyledGrid>
            </ReStyledGrid>


          </ReStyledGrid>

          {/*// 2*/}
          <ReStyledGrid item xs={12}>
            <LoginBtn
              // className={classes.input}
              color="primary"
              variant="contained"
              type="submit"
              // onClick={()=> {fetchAuthUser(data)}}
              >Sign Up
            </LoginBtn>
          </ReStyledGrid>
        </ReStyledGrid>
      </FormStyled>

      <OAuthWrapper>

        <ReAuthenticateButton
          disconnect={() =>
            disconnectTwitch({
              setTwitchAccessToken,
              setEnableTwitch: () => toggleEnabled('google'),
            })
          }
          serviceName='Google'
        />

        <ReAuthenticateButton
          disconnect={() =>
            disconnectTwitch({
              setTwitchAccessToken,
              setEnableTwitch: () => toggleEnabled('twitch'),
            })
          }
          serviceName='Twitch'
        />


        <OAuthLoginButton
          onClick={(e) => handleSpotifyButtonClick(e)}
        >
          <FaSpotifyIcon/>
          Sign in with Spotify
        </OAuthLoginButton>

        <OAuthLoginButton
          onClick={(e) => handleAppleButtonClick(e)}
        >
          <FaApple/>
          Sign in with Apple
        </OAuthLoginButton>

        <br style={{ height: '24px' }} />




        {/*<ReAuthenticateButton
          disconnect={() =>
            disconnectYoutube({
              setYoutubeAccessToken,
              setEnableYoutube: () => toggleEnabled('youtube'),
            })
          }
          serviceName='Youtube'
        />*/}

      </OAuthWrapper>
    </ContainerStyled>
  )
    // }
}

const mapDispatchToProps = dispatch => {
    return {
        login: (creds) => {
            // dispatch(fetchLoginUser(creds))
        }
    }
}

export default connect(null, mapDispatchToProps)(SignUpForm)
