import React from 'react';
import { ThemeProvider } from 'styled-components';
import { RecoilRoot } from 'recoil';
import GlobalStyleThemeMode from 'views/styles/GlobalStyleThemeMode';
import { lightTheme, darkTheme } from 'views/components/Toggle/Themes';
import { useThemeMode } from 'views/components/Toggle/useThemeMode';
import AppWrapper from 'views/components/app/GPT/AppWrapper';

const App = () => {
  const [theme, themeToggler] = useThemeMode();
  const themeMode = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={themeMode}>
      <GlobalStyleThemeMode />
      <AppWrapper theme={theme} themeToggler={themeToggler} />
    </ThemeProvider>
  );
};

const AppRoutesContainer = () => (
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);

export default AppRoutesContainer;
