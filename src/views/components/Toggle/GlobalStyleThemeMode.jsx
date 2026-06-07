import { css } from '@linaria/core';

export const GlobalStyleThemeMode = () => null;

export const globals = css`
  :global() {
    body {
      background: var(--body);
      color: var(--text);

      transition: all 0.0s linear;
    }
  }
`;
