import { setAccessToken } from "core/actions";
import { useDispatch } from "react-redux";

let windowObjectReference = null;
let previousUrl = null;

const openSignInWindow = (url, name) => {
   // remove any existing event listeners
   window.removeEventListener('message', receiveMessage);

   const TopPosition = window.innerHeight ? (window.innerHeight - 850) / 2 : 0;
   const settings = `height=700,width=600,top=${TopPosition},left=50,scrollbars=yes,resizable`;

   // window features
   const strWindowFeatures =
     'toolbar=no, menubar=no, width=800, height=600, top=60, left=250';

   if (windowObjectReference === null || windowObjectReference.closed) {
     /* if the pointer to the window object in memory does not exist
      or if such pointer exists but the window was closed */
     // windowObjectReference = window.open(url, name, strWindowFeatures);
     windowObjectReference = window.open(url, name, settings);
   } else if (previousUrl !== url) {
     /* if the resource to load is different,
      then we load it in the already opened secondary window and then
      we bring such window back on top/in front of its parent window. */
     // windowObjectReference = window.open(url, name, strWindowFeatures);
     windowObjectReference = window.open(url, name, settings);
     windowObjectReference.focus();
   } else {
     /* else the window reference must exist and the window
      is not closed; therefore, we can bring it back on top of any other
      window with the focus() method. There would be no need to re-create
      the window or to reload the referenced resource. */
     windowObjectReference.focus();
   }

   // add the listener for receiving a message from the popup
   window.addEventListener('message', event => receiveMessage(event), false);
   // assign the previous URL
   previousUrl = url;
};

const REACT_APP_CLIENT_URL = "https://localhost:3001"
// const REACT_APP_CLIENT_URL = "https://localhost:8000"
// Additional altcoin-oauth

const receiveMessage = (event) => {

  // Do we trust the sender of this message? (might be different from what we originally opened, for example).
  if (event.origin !== REACT_APP_CLIENT_URL) {
    return;
  }

  // if we trust the sender and the source is our popup
  // if (event.source.name === "SignIn") {
  const { data } = event;
  console.log("cookie data:");
  console.log(data);
  // const token = "JWT " + data.slice(7);
  // const token = "JWT " + data;

  // localStorage.setItem("token", token);

  const access_token = data.access_token;
  localStorage.setItem("token", access_token);
  window.location.pathname = "/feature";


  // }
};
//
// module.exports = {
//   openSignInWindow,
//   receiveMessage,
//   windowObjectReference,
//   previousUrl,
// };

export default openSignInWindow;
