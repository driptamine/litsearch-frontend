import { css } from '@linaria/core';

export const globals = css`
  :global() {
    html {
      font-size: 16px;
      box-sizing: border-box;
    }

    *, *:before, *:after {
      padding: 0;
      margin: 0;
      box-sizing: inherit;
    }

    body {
      margin: 0;
      font-size: 1rem;
      font-family: var(--font, sans-serif);
      color: var(--primaryColor);
      // background-color: var(--bg);
      background-color: red;
      line-height: 1.8;
    }

    h1, h2, h3, h4, h5, h6 {
      font-weight: normal;
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    input, textarea {
      font-family: var(--font, sans-serif);
      font-size: 1rem;
    }

    input:focus, textarea:focus, button:focus, video:focus {
        outline: none;
    }

    button {
      font-family: 'Fira Sans', sans-serif;
      font-size: 1rem;
      cursor: pointer;
    }

    textarea {
      resize: none;
    }

    svg, .pointer {
      cursor: pointer;
    }

    .secondary {
      color: var(--secondaryColor);
    }

    .avatar {
      height: 22px;
      width: 22px;
      border-radius: 10px;
      object-fit: cover;
    }


    .md {
      height: 50px;
      width: 50px;
      border-radius: 25px;
    }

    .small {
      font-size: 0.9rem;
    }

    .lg {
      height: 60px;
      width: 60px;
      border-radius: 30px;
    }

    .flex-row {
      display: flex;
      align-items: center;
    }

    .flex-row img, .flex-row svg {
      margin-right: 0.8rem;
    }

    .ruler {
      height: 1px;
      background: var(--darkGrey);
      margin: 1rem 0;
    }

    .Toastify__toast {
      font-family: var(--font, sans-serif);
      border-radius: 4px;
    }

    .Toastify__toast--error {
      background: var(--darkGrey);
    }

    .Toastify__toast--dark, .Toastify__toast--default {
      background: var(--purple);
      color: #fff;
    }

    @media screen and (max-width: 530px) {
      body {
        font-size: 0.95rem;
      }

      button {
        font-size: 0.9rem;
      }
    }
  }
`;

const GlobalStyle = () => null;

export default GlobalStyle;
