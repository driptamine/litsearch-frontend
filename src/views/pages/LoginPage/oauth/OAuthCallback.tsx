import React, { useEffect } from 'react';

const OAuthCallback = () => {
  useEffect(() => {
    const params = window.location.search;
    if (window.opener) {
      window.opener.postMessage(params);
      window.close();
    }
    console.log(params);
    window.postMessage(params);
  }, []);

  return <p>Please wait...</p>;
};

export default OAuthCallback;