import { createGlobalStyle} from "styled-components"

export const GlobalStyleThemeMode = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};

    transition: all 0.0s linear;
  }
`
