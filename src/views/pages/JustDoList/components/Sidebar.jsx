import React from 'react';
import { styled } from '@linaria/react';


const Sidebar = ({children}) => {
  return (
    <SidebarContainer>
      <Logo>JustDoList</Logo>
      <NavItem>All</NavItem>
      <NavItem>Inbox</NavItem>
      <NavItem>Today</NavItem>
      <NavItem>Completed</NavItem>

      {children}
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: 220px;
  height: 100vh;
  background-color: #3f51b5;
  color: #fff;
  padding: 2rem 1rem;
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    width: 100%;
    height: auto;
    padding: 1rem;
  }
`;

const Logo = styled.h2`
  margin-bottom: 2rem;
  font-weight: bold;
`;

const NavItem = styled.div`
  margin-bottom: 1rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
export default Sidebar;
