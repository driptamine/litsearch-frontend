import { styled } from '@linaria/react';

export const Header = styled.header`
  background-color: ${({ theme }) => theme?.colors?.header};
  padding: 20px;
  text-align: center;
  font-weight: bold;
`;
