import { styled } from '@linaria/react';
import { css } from '@linaria/core';

const Button = styled.button`
  padding: 0.4rem 1rem;
  background: var(--red);
  color: var(--white);
  border: 1px solid var(--red);
  border-radius: 3px;
  letter-spacing: 1.1px;

  ${(props) =>
    props.grey &&
    css`
      background: var(--darkGrey);
      border: 1px solid var(--darkGrey);
      color: var(--secondaryColor);
    `}
`;

export default Button;
