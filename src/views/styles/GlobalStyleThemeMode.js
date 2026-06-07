import { css } from '@linaria/core';

export const globals = css`
  :global() {
    html {
      box-sizing: border-box;
    }

    *, *::before, *::after {
      box-sizing: inherit;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      background: var(--body);
      color: var(--text);
    }

    img {
      max-width: 100%;
      height: auto;
    }

    ::-webkit-scrollbar {
      /* display: none; */
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      /* display: none; */

      border: 5px solid transparent;
      background: hsla(0,0%,100%,.3);
      background-clip: content-box;
      border-radius: 10px;
    }
  }
`;

const GlobalStyleThemeMode = () => null;

export default GlobalStyleThemeMode;
