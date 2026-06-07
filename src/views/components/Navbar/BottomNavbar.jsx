import React from 'react';
import { styled } from '@linaria/react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaMusic, FaImage, FaFilm } from 'react-icons/fa';
import { TbMessageCircle } from 'react-icons/tb';
import { LuLayoutList } from "react-icons/lu";

const BottomNavbar = () => {
  const { pathname } = useLocation();

  const navItems = [
    { icon: <FaHome size={20} />, label: 'Feed', path: '/feed' },
    { icon: <TbMessageCircle size={20} />, label: 'Chat', path: '/chat/im' },
    { icon: <FaMusic size={20} />, label: 'Music', path: '/musicv2' },
    { icon: <FaFilm size={20} />, label: 'Videos', path: '/videos' },
    { icon: <FaImage size={20} />, label: 'Photos', path: '/photos' },
  ];

  return (
    <Wrapper>
      {navItems.map((item) => (
        <NavItem key={item.path} to={item.path} active={pathname === item.path}>
          {item.icon}
          <Label>{item.label}</Label>
        </NavItem>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: var(--navBg, #121212);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid var(--navBorderColor, #333);
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
`;

const navItemStyles = props => `
  color: ${props.active ? 'var(--primary, #bb86fc)' : 'var(--text, #fff)'};
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  ${navItemStyles}
  font-size: 10px;
  flex: 1;
  height: 100%;

  &:hover {
    color: var(--primary, #bb86fc);
  }
`;

const Label = styled.span`
  margin-top: 4px;
`;

export default BottomNavbar;
