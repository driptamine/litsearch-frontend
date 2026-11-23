import { styled } from '@linaria/react';

export const StyledTab = styled.button`
  margin-left: 10px;

  @media screen and (max-width: 600px) {
    padding: 10px 15px;
    cursor: pointer;
    flex-shrink: 0;
    font-family: arial, sans-serif;
    font-size: 14px;
    
    &:first-child {
      margin-left: 0;
    }
  }
`;
