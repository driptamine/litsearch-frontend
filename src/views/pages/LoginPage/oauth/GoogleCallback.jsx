import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { parse } from './utils';
import { setAccessToken } from "core/actions";

const queryToObject = (query) => {
	const parameters = new URLSearchParams(query);
	return Object.fromEntries(parameters.entries());
};

export default function GoogleCallback() {
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();


  useEffect(() => {
    const params = parse(window.location.search);
    const payload = queryToObject(window.location.search.split('?')[1]);

      // window.opener.postMessage(params);
      // window.postMessage(params);
    if (window.opener){
      // window.opener.postMessage({ access_token: "DRIPTAMINE", from: 'Linked In'}, '*',);
      window.opener.postMessage({ access_token: params, from: 'SignIn'}, '*',);
      console.log("BOB-opener");
    }

    // window.postMessage({ access_token: params, from: 'SignIn'}, '*',);
    window.opener.postMessage({ access_token: params, from: 'SignIn'}, '*',);
    console.log("BOB-NOT");
    // const token = getCookie()
    dispatch(setAccessToken(params));
    // window.close()


  }, []);

  return <div>test</div>;
}

// localhost:8000/ reditrect to  --- >   localhost:3000/google/callback?token=  then window.close()
