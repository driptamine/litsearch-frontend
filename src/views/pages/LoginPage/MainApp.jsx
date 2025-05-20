// import React from 'react';
// import { Helmet } from 'react-helmet';
// import { Route, Switch } from 'react-router-dom';
// import styled from 'styled-components';
// // import PrivateRoute from '../../components/PrivateRoute';
// // import App from '../App';
// // import LoginContainers from '../Login';
// // import LogoutContainer from '../Logout';
// import UnsplashCallback from './UnsplashCallback';
// // import Progress from '../../components/Progress';
//
// const Wrapper = styled.div`
//   height: 100%;
// `;
//
//
// const MainApp = ({ ...others }) => (
//   <Wrapper {...others}>
//     <Helmet>
//       <meta charSet="utf-8" />
//       <title>Unsplash clone app</title>
//     </Helmet>
//
//     <Switch>
//       <Route exact path="/auth/callback" component={UnsplashCallback} />
//       <Route path="/auth" component={LoginContainers} />
//       <Route path="/logout" component={LogoutContainer} />
//       <PrivateRoute path="/" component={App} />
//     </Switch>
//
//     <Progress />
//   </Wrapper>
// );
//
// export default MainApp;
