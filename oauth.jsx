// /* global gapi */
// import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';
// import React, { Component } from 'react';
// import './App.css';
// import Header from './Header';
// import User from './User';
// var GoogleAuth;
// var gapi;
// class App extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       isAuthorized: false,
//       user: '',
//       userDisplay: ''
//     }
//   }
//   setSigninStatus() {
//     let user = GoogleAuth.currentUser.get();
//     let isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/drive.metadata.readonly');
//     if (isAuthorized) {
//       let first = user.w3.ofa
//       let last = user.w3.wea
//       let full = first+last
//       let display = user.w3.ig
//       let fullName = full.toLowerCase();
//       this.setState({
//         isAuthorized: true,
//         user: fullName,
//         userDisplay: display
//       })
//       console.log(this.state.isAuthorized)
//       document.getElementById('sign-in-or-out-button').innerHTML = 'Sign out'
//       document.getElementById('revoke-access-button').style.display = 'inline-block'
//       document.getElementById('auth-status').innerHTML = `Welcome ${user.w3.ofa}, you are currently signed in and have granted access to this app.`
//     } else {
//       this.setState({
//         isAuthorized: false,
//         user: '',
//         userDisplay: ''
//       })
//       console.log(this.state.isAuthorized)
//       document.getElementById('sign-in-or-out-button').innerHTML = 'Sign in'
//       document.getElementById('revoke-access-button').style.display = 'none'
//       document.getElementById('auth-status').innerHTML = 'You have not authorized this app or you are signed out.'
//     }
//   }
//   loadApi = () => {
//     window.gapi.load('client:auth2', this.initClient)
//   }
//   initClient = () => {
//     window.gapi.client.init({
//       'apiKey': 'YOUR_API_KEY',
//       'clientId': 'YOUR_CLIENT_ID',
//       'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
//       'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
//     }).then(() => {
//       GoogleAuth = window.gapi.auth2.getAuthInstance();
//       GoogleAuth.isSignedIn.listen(this.updateSigninStatus);
//       this.setSigninStatus();
//       document.getElementById('sign-in-or-out-button').addEventListener('click', () => {
//         this.handleAuthClick();
//       });
//       document.getElementById('revoke-access-button').addEventListener('click', () => {
//         this.revokeAccess();
//       });
//     });
//   }
//   handleAuthClick = () => {
//     if (GoogleAuth.isSignedIn.get()) {
//       GoogleAuth.signOut();
//     } else {
//       GoogleAuth.signIn();
//     }
//   }
//   revokeAccess = () => {
//     GoogleAuth.disconnect();
//   }
//   updateSigninStatus = () => {
//     this.setSigninStatus();
//   }
//   componentDidMount() {
//     this.loadApi();
//   }
//   render() {
//     const isAuthorized = this.state.isAuthorized;
//     const user = this.state.user;
//      return (
//       <Router>
//         { !isAuthorized ? (
//             <Switch>
//               <Route exact path="/" />
//               <Redirect to="/" />
//             </Switch>
//           ) : (
//             <Switch>
//               <Route exact path={`/u/${user}`} render={(props) => <User {...props} display={this.state.userDisplay} user={this.state.user} />} />
//               <Redirect from="/" to={`/u/${user}`} />
//             </Switch>
//           )
//         }
//         <Header />
//       </Router>
//      );
//   }
// }
//
// export default App;
