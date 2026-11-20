import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import { GOOGLE_CALLBACK_URL, LITLOOP_API_URL } from 'core/constants/urls';
import { saveAuthCookies } from 'core/utils/authCookies';
import Alert from 'views/pages/Alert';
import LoadingIndicatorz from 'views/pages/LoadingIndicatorz';
import { AddCookie, getCookie, RemoveCookie } from 'views/utils';

const GoogleAuthCallback = () => {
  const [error, setError] = useState('');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const completeSignIn = async () => {
      const params = new URLSearchParams(window.location.search);
      const state = params.get('state');
      if (!state || state !== getCookie('Google-myState')) {
        setError('This sign-in request expired. Start a new Google sign-in.');
        return;
      }
      RemoveCookie('Google-myState');

      const code = params.get('code');
      if (params.has('error') || !code) {
        setError('Google did not complete the sign-in request.');
        return;
      }

      try {
        const { data } = await axios.post(`${LITLOOP_API_URL}/auth/google/token/`, {
          code,
          redirect_uri: GOOGLE_CALLBACK_URL,
        });
        const { access, refresh, user } = data;
        if (!access || !refresh || !user?.id) {
          setError('LitLoop did not return a complete sign-in session.');
          return;
        }

        const session = {
          service: 'google',
          access_token: access,
          refresh_token: refresh,
          username: user.username,
          avatar: user.avatar,
          email: user.email,
          userId: user.id,
        };
        AddCookie('Google-access_token', access);
        AddCookie('Google-refresh_token', refresh);

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(session, window.location.origin);
          window.close();
        } else {
          saveAuthCookies(session);
          window.location.replace('/feed');
        }
      } catch (requestError) {
        const message = requestError.response?.data?.error;
        setError(typeof message === 'string' ? message : 'Could not complete Google sign-in. Try again.');
      }
    };

    completeSignIn();
  }, []);

  if (error) {
    return <Alert type="error" title="Google sign-in failed" message={error} />;
  }

  return (
    <LoadingIndicatorz
      height={150}
      width={150}
      text="Authenticating…"
      smallText="Talking with Google…"
    />
  );
};

export default GoogleAuthCallback;
