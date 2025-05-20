import styled, { ThemeProvider } from 'styled-components';

const lit_theme = {
  spacing: '8px',
  colors: {

  },
  fonts: [],
  fontSizes: {

  },
  fontWeights: {}

};

export default function Theme({children}) {
  return (
    <ThemeProvider theme={lit_theme}>
      {children}
    </ThemeProvider>
  )
}
