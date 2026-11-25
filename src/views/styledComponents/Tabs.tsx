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

  @media (max-width: 768px) {
    position: sticky;
    top: 60px; /* below app header */
    z-index: 100;
    background: var(--navBg);
    padding-top: 10px;
    padding-bottom: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;
