import React, { useState, useEffect, useContext } from 'react'
import { useDispatch, useSelector} from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { FRONTEND_CALLBACK_URL } from 'core/constants/urls';

// ICONS
import { FaSpotify } from 'react-icons/fa';
import { FaSoundcloud } from 'react-icons/fa';
import { styled } from '@linaria/react';


// MATERIAL DONE
import { StyledGrid } from 'views/styledComponents';

// VIEWS
import {
  googleSignInAction, unsplashSignInAction, deezerSignInAction, instagramSignInAction } from 'views/pages/LoginPage/action'
import ReAuthenticateButton from 'views/pages/Auth/ReAuthenticateButton';

// CONTEXT PROVIDER
import { YoutubeContext } from 'views/pages/Auth/youtube/useToken';
import { GoogleContext } from 'views/pages/Auth/google/useToken';

import litloopLogo from 'views/assets/litloopLogo3.png';

// CORE
import history  from 'core/services/history'
import { fetchAuthUser, fetchOAuthUser, fetchCurrentUser } from 'core/actions'
import useHistoryPush from 'core/hooks/useHistoryPush';
import { selectors } from 'core/reducers/index';
import { useFeedPreferences } from 'core/atoms/atoms';
import useEventListenerMemo from 'core/hooks2/useEventListenerMemo';



function LoginForm () {
  const {
    // youtubeVideoHoverEnable,
    // setYoutubeVideoHoverEnable,
    // setYoutubeAccessToken,
    // youtubeAccessToken,
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
    console.log("LOGINNN");
    dispatch(fetchAuthUser({
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






  // const { setTwitchAccessToken, setTwitchRefreshToken, setTwitchUserId, setTwitchUsername, setTwitchProfileImage, } = useContext(TwitchContext) || {};
  // const { setYoutubeAccessToken, setYoutubeRefreshToken, setYoutubeUsername, setYoutubeProfileImage } = useContext(YoutubeContext) || {};
  const { setGoogleAccessToken, setGoogleRefreshToken, setGoogleUsername, setGoogleProfileImage } = useContext(GoogleContext) || {};



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
        history.push('/feed');
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


      </LitLoopDiv>
      <FormStyled onSubmit={(e) => handleSubmit(e)}>
        <GridItem container

          >
          {/*// 1*/}
          <GridItem
            item xs={12}

          >
            <GridItem>
              <GridItem


                >
                <TextFieldStyledInput

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
                  placeholder="Email or Username"
                />
              </GridItem>
              <GridItem item
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
                    // error={errors.password}
                  placeholder="Password"
                />
              </GridItem>
            </GridItem>


          </GridItem>

          {/*// 2*/}
          <GridItem item xs={12}>
            <LoginBtn
              // className={classes.input}
              color="primary"
              variant="contained"
              // type="submit"
              onClick={handleSubmit}
              >Login
            </LoginBtn>
            <Link to="/signup">Not Registered yet? Signup</Link>
          </GridItem>
        </GridItem>
      </FormStyled>

      <OAuthWrapper>

        <ReAuthenticateButton
          // disconnect={() =>
          //   disconnectTwitch({
          //     setTwitchAccessToken,
          //     setEnableTwitch: () => toggleEnabled('google'),
          //   })
          // }
          serviceName='Google'
          title="Sign in with Google"
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
    </ContainerStyled>
  )
    // }
}

const ContainerStyled = styled.div`
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
  background: white;
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

const GridItem = styled(StyledGrid)`
  margin-bottom: 1em;

`

export default LoginForm;
