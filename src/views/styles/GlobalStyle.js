import { css } from '@linaria/core';

export const globals = css`
  :global() {
    body {
      margin: 0;
      // background: #181818;
      background: red;
    }

    div#dropdown-root {
      position: absolute;
      z-index: 2121212;
      top: 8%;
      right: 6%;
      color: red;
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

const GlobalStyle = () => null;

export default GlobalStyle;
