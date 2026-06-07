import React, { useState, useEffect } from 'react';
import { GlobalStyles } from './components/styles/Global';
import { Header } from './components/styles/Header.styled';
import { Footer } from './components/styles/Footer.styled';
import Quotes from './components/Quotes';
import { ThemeContainer, ThemeButton,} from './components/styles/ThemeSwitching.styled';
import { light, dark, blue, green, brown, pink, } from './components/styles/Theme.styled';

function App() {
  // ... rest of component logic
  return (
    <>
      <div className="App">
        <GlobalStyles />
        <Header>Game of Thrones Quotes</Header>

        <ThemeContainer>
          <span>Themes: </span>
          <ThemeButton className={`light ${selectedTheme === light ? "active" : ""}`} onClick={() => HandleThemeChange(light)}></ThemeButton>
          <ThemeButton className={`dark  ${selectedTheme === dark ? "active" : ""}`}  onClick={() => HandleThemeChange(dark)}></ThemeButton>
          <ThemeButton className={`blue  ${selectedTheme === blue ? "active" : ""}`}  onClick={() => HandleThemeChange(blue)}></ThemeButton>
          <ThemeButton className={`green ${selectedTheme === green ? "active" : ""}`} onClick={() => HandleThemeChange(green)}></ThemeButton>
          <ThemeButton className={`brown ${selectedTheme === brown ? "active" : ""}`} onClick={() => HandleThemeChange(brown)}></ThemeButton>
          <ThemeButton className={`pink  ${selectedTheme === pink ? "active" : ""}`}  onClick={() => HandleThemeChange(pink)}></ThemeButton>
        </ThemeContainer>

        <Quotes />

        {/* Nesting ThemeProviders */}
        {/* <>
          <Quotes />
        </> */}

        <Footer>
          <p>
            Made with love by <a href="https://link.timonwa.com">Timonwa</a>
          </p>
        </Footer>

        {/* Passing a theme directly into a component */}
        {/* <Footer
          theme={{
            colors: {
              background: "hsl(37, 83%, 54%)",
              footer: "hsl(39, 50%, 20%)",
            },
          }}>
          <p>
            Made with love by <a href="https://link.timonwa.com">Timonwa</a>
          </p>
        </Footer> */}

        {/* inverted theme */}
        {/* <>
          <Footer>Inverted Footer</Footer>
        </> */}
      </div>
    </>
  );
}

export default App;
