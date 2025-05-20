import React, { useEffect }  from "react";

// export default function OAuthCallback () {
const OAuthCallback = () => {

  useEffect(() => {
    // get the URL parameters which will include the auth token
    const params = window.location.search;
    if (window.opener) {
      // send them to the opening window
      window.opener.postMessage(params);
      // close the popup
      window.close();
    }
    console.log(params);
    window.postMessage(params);

    // window.close();
  });

  // some text to show the user
  return <p>Please wait...</p>;
};

export default OAuthCallback;
