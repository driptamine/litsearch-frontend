import { styled } from '@linaria/react';

const listItemStyles = props => `
  &:hover {
    background-color: ${props.hover ? 'rgb(92 92 92 / 10%)' : 'transparent'};
  }
  cursor: ${props.hover ? 'pointer' : 'unset'};
`;

export const StyledListItem = styled.li`
  display: flex;
  ${listItemStyles}
`;
