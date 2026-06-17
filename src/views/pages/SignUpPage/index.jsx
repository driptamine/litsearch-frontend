
import React, { useState, useEffect, useContext } from 'react'
import { connect, useDispatch, useSelector} from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';

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

import { styled } from '@linaria/react';


import { StyledTextField, StyledContainer, StyledGrid, StyledButton } from 'views/styledComponents';


import {
  googleSignInAction, unsplashSignInAction, deezerSignInAction, instagramSignInAction } from 'views/pages/LoginPage/action'
import ReAuthenticateButton from 'views/pages/Auth/ReAuthenticateButton';
import disconnectYoutube from 'views/pages/Auth/youtube/disconnectYoutube';

// CONTEXT PROVIDER
import { YoutubeContext } from 'views/pages/Auth/youtube/useToken';
import { GoogleContext } from 'views/pages/Auth/google/useToken';
import { VkContext } from 'views/pages/Auth/vk/useToken';

import litloopLogo from 'views/assets/litloopLogo3.png';

// CORE
import history  from 'core/services/history';
import { fetchAuthUser, fetchSignUpUser, fetchOAuthUser, fetchCurrentUser  } from 'core/actions'
import RouterLink from 'views/components/RouterLink';
import useHistoryPush from 'core/hooks/useHistoryPush';
// import { selectAuth } from 'core/reducers/authSlice';
import { selectors } from 'core/reducers/index';
import { feedPreferencesAtom, useFeedPreferences } from 'core/atoms/atoms';
import useEventListenerMemo from 'core/hooks2/useEventListenerMemo';



function SignUpForm () {
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

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isError, setIsError] = useState(false);

  // if (authSelector.authenticated) {
  //   return <Redirect to={"/"} />;
  //   // navigate("/")
  // }

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(fetchSignUpUser({
      email: email,
      password: password
    }))

    // window.location.replace("http://localhost:3001/");

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
  const { setVkAccessToken, setVkRefreshToken, setVkUsername, setVkProfileImage } = useContext(VkContext) || {};



  function receiveMessage(e) {
    if (e.origin.startsWith(`${FRONTEND_CALLBACK_URL}`) && e.data?.access_token && e.data?.service) {
      const { service, access_token, refresh_token, username, userId } = e.data;
      const profileImg = e.data.profileImg || e.data.profile_img || e.data.picture || e.data.avatar_url || e.data.avatar;

      if (service === 'google') {
        console.log("Receive postMessage GOOGLE TOKEN");
        console.log(e.data);
        if (access_token && setGoogleAccessToken) setGoogleAccessToken(access_token);
        if (username && setGoogleUsername) setGoogleUsername(username);
        if (profileImg && setGoogleProfileImage) setGoogleProfileImage(profileImg);

        dispatch(fetchOAuthUser({ ...e.data, profileImg }));
        dispatch(fetchCurrentUser());
        history.push('/');
      } else if (service === 'vk') {
        if (access_token && setVkAccessToken) setVkAccessToken(access_token);
        if (username && setVkUsername) setVkUsername(username);
        if (profileImg && setVkProfileImage) setVkProfileImage(profileImg);

        dispatch(fetchOAuthUser({ ...e.data, profileImg }));
        dispatch(fetchCurrentUser());
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
                  name="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="Email"
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
          serviceName='Google'
          title="Sign up with Google"
        />

        <ReAuthenticateButton
          serviceName='Vk'
          title="Sign up with VK"
        />

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

      <LoginLinkWrapper>
        <LoginLinkText>Already have an account? <LoginLink to="/login">Log In</LoginLink></LoginLinkText>
      </LoginLinkWrapper>
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
  height: 90px;
  max-width: 100%;
  object-fit: contain;

  display: block;
  margin-left: auto;
  margin-right: auto;
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

const LoginLinkWrapper = styled.div`
  text-align: center;
  margin-top: 1.5em;
  margin-bottom: 1em;
`;

const LoginLinkText = styled.p`
  color: white;
  font-family: Verdana;
  font-size: 14px;
`;

const LoginLink = styled(RouterLink)`
  color: #686cb9;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
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
export default connect(null, mapDispatchToProps)(SignUpForm)
