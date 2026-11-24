import { css } from '@linaria/core';
import * as theme from './Theme.styled';

const globalBodyStyles = props => `
  background-color: ${props.theme?.colors?.background};
  color: ${props.theme?.colors?.text};
`;

const globalActiveStyles = props => `
  border: 3px solid ${props.theme?.colors?.border};
`;

export const GlobalStyles = css`
  :global() {
    *,
    *::before,
    *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      ${globalBodyStyles}
      font-family: monospace;
      overflow-x: hidden;
    }

    // theme buttons color
    .light {
      background-color: ${theme.light.colors.header};
    }
    .dark {
      background-color: ${theme.dark.colors.header};
    }
    .blue {
      background-color: ${theme.blue.colors.header};
    }
    .green {
      background-color: ${theme.green.colors.header};
    }
    .brown {
      background-color: ${theme.brown.colors.header};
    }
    .pink {
      background-color: ${theme.pink.colors.header};
    }

    // active theme
    .active{
      ${globalActiveStyles}
    }
  }
`;
