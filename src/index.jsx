import React from "react";
import ReactDOM, { createRoot }  from 'react-dom/client';
import { Router, useLocation, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';

// VIEWS
import App from "views/components/app";
import AppHeader from "views/components/AppHeader";
import LoginPage from "views/pages/LoginPage";
import ConfigurationProvider from "views/components/ConfigurationProvider";
import  Theme  from "views/theme/index";
import { darkTheme } from "views/theme/darktheme";

// import 'views/style/global';
// import GlobalStyle from 'views/style/global';
import GlobalStyle from 'views/styles/GlobalStyle';

import * as serviceWorker from "./serviceWorker";
// import store from "./store";


// CORE
// import { store, persistor, sagaMiddleware } from 'core/store';
// import  store  from 'core/store/storeV1';
// import  store  from 'core/store/storeV3';
// import  store  from 'core/store/storeV4';
import  store  from 'core/store/storeV5_GPT';

// import { store, sagaMiddleware } from 'core/store/storeV2';

import 'views/components/Toggle/Themes.scss';


import history  from "core/services/history";

// store.runSaga(rootSaga);

// sagaMiddleware.run(rootSaga);


const container = document.getElementById('root');
const root = createRoot(container);


root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/*<PersistGate loading={null} persistor={persistor}>*/}

        {/*<ThemeProvider theme={theme}>*/}
        {/*<Theme>*/}
          {/*<CssBaseline />*/}
          {/*<GlobalStyle />*/}
          <ConfigurationProvider>

            {/*<BrowserRouter>*/}

            <Router history={history}>
              <App />
            </Router>
            {/*</BrowserRouter>*/}

          </ConfigurationProvider>
        {/*</Theme>*/}
        {/*</ThemeProvider>*/}

      {/*</PersistGate>*/}
    </Provider>
  </React.StrictMode>

);

// if (import.meta.env.NODE_ENV !== "production" && module.hot) {
//   module.hot.accept("views/components/app/App", renderApp);
// }

// renderApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
