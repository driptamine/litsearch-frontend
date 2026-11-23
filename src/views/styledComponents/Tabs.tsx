import { styled } from '@linaria/react';

export const StyledTabs = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  border-bottom: 1px solid #ddd;
  padding: 0 10px 5px 10px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
