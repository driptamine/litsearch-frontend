import { useEffect, useState } from 'react';
import { LINKEDIN_OAUTH2_STATE, parse } from './utils';

export function GoogleCallback() {

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const params = parse(window.location.search);
    //
    // const token = parseCookieToken(window.location.search);

    if (params.state !== localStorage.getItem(LINKEDIN_OAUTH2_STATE)) {
      setErrorMessage('State does not match');
    } else if (params.error) {
      const errorMessage = params.error_description || 'Login failed. Please try again.';
      window.opener && window.opener.postMessage(
        {
          error: params.error,
          state: params.state,
          errorMessage,
          from: 'Linked In',
        },
        window.location.origin,
      );

      // Close popup
      // Close tab if user cancelled login
      if (params.error === 'user_cancelled_login') {
        window.close();
      }
    }

    // if (params.code) {
    if (params.access_token) {

      // window.opener.postMessage(params);
      // window.postMessage(params);

      window.opener && window.opener.postMessage(
        {
          access_token: params.access_token,
          state: params.state,
          from: 'Linked In'
        },
        window.location.origin,
      );

      window.close()

    }
  }, []);

  return <div>{errorMessage}</div>;
}

// localhost:8000/ reditrect to  --- >   localhost:3000/google/callback?token=  then window.close()
