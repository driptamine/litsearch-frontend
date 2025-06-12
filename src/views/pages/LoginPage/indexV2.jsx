import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import {
  twitchSignInAction, googleSignInAction, appleSignInAction,
  spotifySignInAction, unsplashSignInAction, deezerSignInAction, instagramSignInAction
} from 'views/pages/LoginPage/action';
import { TwitchContext } from 'views/pages/Auth/twitch/useToken';
import { YoutubeContext } from 'views/pages/Auth/youtube/useToken';
import { GoogleContext } from 'views/pages/Auth/google/useToken';
import { SpotifyContext } from 'views/pages/Auth/spotify/useToken';

import litloopLogo from 'views/assets/litloopLogo3.png';
import { fetchAuthUser } from 'core/actions';
import { selectors } from 'views/pages/LoginPage/action';
import useEventListenerMemo from 'core/hooks2/useEventListenerMemo';
import history  from 'views/pages/LoginPage/action';

import ReAuthenticateButton from 'views/pages/Auth/ReAuthenticateButton';
import { FaSpotify, FaApple } from 'react-icons/fa';

import { StyledGrid as Grid } from 'views/styledComponents';

const LoginForm = () => {
  const dispatch = useDispatch();
  // const history = useHistory();
  const { setTwitchAccessToken, setTwitchRefreshToken, setTwitchUsername, setTwitchUserId, setTwitchProfileImage } = useContext(TwitchContext) || {};
  const { setGoogleAccessToken, setGoogleUsername, setGoogleProfileImage } = useContext(GoogleContext) || {};

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(fetchAuthUser({ email, password }));
  };

  const handleSocialClick = (action) => async (e) => {
    e.preventDefault();
    try {
      dispatch(action());
    } catch (err) {
      console.log(err);
      setIsError(true);
    }
  };

  const receiveMessage = (e) => {
    if (!e.origin.startsWith('http://localhost:3001')) return;
    const { access_token, refresh_token, username, userId, profileImg, service } = e.data;
    if (!access_token || !service) return;

    if (service === 'twitch') {
      setTwitchAccessToken(access_token);
      setTwitchRefreshToken(refresh_token);
      setTwitchUsername(username);
      setTwitchUserId(userId);
      setTwitchProfileImage(profileImg);
    } else if (service === 'google') {
      console.log("Receive postMessage GOOGLE TOKEN");
      console.log(e.data);

      // setGoogleAccessToken(access_token);
      // setGoogleUsername(username);
      // setGoogleProfileImage(profileImg);


      if (e.data.access_token && setGoogleAccessToken) setGoogleAccessToken(e.data.access_token);
      if (e.data.username && setGoogleUsername) setGoogleUsername(e.data.username);
      if (e.data.profileImg && setGoogleProfileImage) setGoogleProfileImage(e.data.profileImg);
      history.push('/feed');
    }
    // history.push('/');
  };

  useEventListenerMemo('message', receiveMessage, window, true, { capture: false });

  return (
    <Container>
      <Header>
        <Logo src={litloopLogo} />
        <Title>LitLoop</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        <Grid item xs={12}>
          <Input
            type="text"
            placeholder="Email or Username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="on"
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="on"
          />
        </Grid>
        <Grid item xs={12}>
          <LoginButton onClick={handleSubmit}>Login</LoginButton>
          <Link to="/signup">Not Registered yet? Signup</Link>
        </Grid>
      </Form>

      <OAuthWrapper>
        <ReAuthenticateButton serviceName='Google' />
        <OAuthButton onClick={handleSocialClick(spotifySignInAction)}><FaSpotify /> Sign in with Spotify</OAuthButton>
        <OAuthButton onClick={handleSocialClick(appleSignInAction)}><FaApple /> Sign in with Apple</OAuthButton>
      </OAuthWrapper>
    </Container>
  );
};

const Container = styled.div`
  margin: 2em auto;
  padding: 2em;
  border: 4px solid black;
  border-radius: 11px;
  background: black;
  color: white;
  max-width: 600px;
`;

const Header = styled.div`
  text-align: center;
`;

const Logo = styled.img`
  width: 10%;
`;

const Title = styled.h2`
  font-family: Verdana;
  color: white;
`;

const Form = styled.form`
  text-align: center;
  margin: auto;
  width: 80%;
`;

const Input = styled.input`
  width: 100%;
  margin: 0.5em 0;
  padding: 15px;
  border-radius: 10px;
  border: none;
  box-sizing: border-box;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(45deg, #673ab7 30%, #3f51b5 90%);
  color: white;
  cursor: pointer;
  margin: 1em 0;
`;

const OAuthWrapper = styled.div`
  margin-top: 2em;
  text-align: center;
`;

const OAuthButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 1em auto;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 66%;
`;

export default LoginForm;
