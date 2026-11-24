import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { parse } from './utils';
import { setAccessToken } from 'core/actions';

const queryToObject = (query: string): Record<string, string> => {
  const parameters = new URLSearchParams(query);
  return Object.fromEntries(parameters.entries());
};

export default function GoogleCallback() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const dispatch = useDispatch();

  useEffect(() => {
    const params = parse(window.location.search);
    const payload = queryToObject(window.location.search.split('?')[1]);

    if (window.opener) {
      window.opener.postMessage({ access_token: params, from: 'SignIn' }, '*');
      console.log('BOB-opener');
    }

    window.opener.postMessage({ access_token: params, from: 'SignIn' }, '*');
    console.log('BOB-NOT');
    dispatch(setAccessToken(params));
  }, [dispatch]);

  return <div>test</div>;
}