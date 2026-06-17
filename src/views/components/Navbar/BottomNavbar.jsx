import React from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@linaria/react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaMusic, FaImage, FaFilm } from 'react-icons/fa';
import { MdAlbum } from 'react-icons/md';
import { TbMessageCircle } from 'react-icons/tb';
import { LuLayoutList } from "react-icons/lu";
import { useNotifications } from 'core/context/NotificationContext';

const BottomNavbar = () => {
  const { pathname } = useLocation();
  const username = useSelector((state) => state.users?.username || state.users?.user__username);
  const { unreadChatCount } = useNotifications();

  const navItems = [
    { icon: <FaHome size={20} />, label: 'Feed', path: '/feed' },
    { icon: <TbMessageCircle size={20} />, label: 'Chat', path: '/chat/im', badge: unreadChatCount },
    { icon: <FaMusic size={20} />, label: 'Music', path: '/musicv2' },
    { icon: <FaFilm size={20} />, label: 'Videos', path: '/videos' },
    { icon: <MdAlbum size={20} />, label: 'Albums', path: `/${username}/albums` },
    { icon: <FaImage size={20} />, label: 'Photos', path: `/${username}/photos` },
    { icon: <FaFilm size={20} />, label: 'Videos', path: `/${username}/videos` },
  ];

  return (
    <Wrapper>
      {navItems.map((item) => (
        <NavItem key={item.path} to={item.path} active={pathname === item.path}>
          <IconWrapper>
            {item.icon}
            {item.badge > 0 && <Badge>{item.badge > 99 ? '99+' : item.badge}</Badge>}
          </IconWrapper>
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

const IconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Badge = styled.span`
  position: absolute;
  top: -6px;
  right: -8px;
  background-color: #ff4444;
  color: white;
  font-size: 9px;
  font-weight: 700;
  min-width: 16px;
  height: 14px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  line-height: 1;
`;

export default BottomNavbar;
