import React from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@linaria/react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaMusic, FaImage, FaFilm, FaSearch } from 'react-icons/fa';
import { MdAlbum } from 'react-icons/md';
import { TbMessageCircle } from 'react-icons/tb';
import { useNotifications } from 'core/context/NotificationContext';

const BottomNavbar = () => {
  const { pathname } = useLocation();
  const username = useSelector((state) => state.users?.username || state.users?.user__username);
  const { unreadChatCount } = useNotifications();

  const navItems = [
    { icon: <FaHome size={20} />, label: 'Feed', path: '/feed' },
    { icon: <TbMessageCircle size={20} />, label: 'Chat', path: '/chat/im', badge: unreadChatCount },
    { icon: <FaSearch size={20} />, label: 'Search', path: '/' },
    { icon: <FaMusic size={20} />, label: 'Music', path: '/musicv2' },
    { icon: <MdAlbum size={20} />, label: 'Albums', path: `/${username}/albums` },
    { icon: <FaImage size={20} />, label: 'Photos', path: `/${username}/photos` },
    { icon: <FaFilm size={20} />, label: 'Videos', path: '/videos' },
  ];

  return (
    <Wrapper>
      <Tabbar>
        {navItems.map((item) => (
          <TabItem key={item.path} to={item.path} active={pathname === item.path}>
            <IconWrap>
              {item.icon}
              {item.badge > 0 && <Badge>{item.badge > 99 ? '99+' : item.badge}</Badge>}
            </IconWrap>
          </TabItem>
        ))}
      </Tabbar>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  position: fixed;
  bottom: 12px;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  padding: 0 12px env(safe-area-inset-bottom);
  pointer-events: none;
`;

const Tabbar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  width: 100%;
  max-width: 480px;
  height: 60px;
  overflow: hidden;
  border-radius: 50px;
  backdrop-filter: blur(17px);
  -webkit-backdrop-filter: blur(17px);
  background: rgba(0, 0, 0, 0.25);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 1px 1px rgba(255, 255, 255, 0.06),
    inset -1px -1px rgba(255, 255, 255, 0.06),
    0 -4px 24px rgba(0, 0, 0, 0.3);
  pointer-events: auto;

  [data-theme='light'] & {
    background: rgba(255, 255, 255, 0.65);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.5),
      inset 1px 1px rgba(255, 255, 255, 0.7),
      inset -1px -1px rgba(255, 255, 255, 0.7),
      0 -4px 24px rgba(0, 0, 0, 0.08);
  }
`;

const TabItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #fff !important;
  fill: #fff !important;
  font-size: 10px;
  height: 100%;
  position: relative;
  transition: color 0.2s ease;

  &:visited {
    color: #fff !important;
    fill: #fff !important;
  }

  &:hover,
  &[active="true"] {
    color: #fff !important;
    fill: #fff !important;
  }

  svg {
    color: #fff !important;
    fill: #fff !important;
  }

  &[active="true"] svg {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
  }

  [data-theme='light'] &,
  [data-theme='light'] &:visited,
  [data-theme='light'] &:hover,
  [data-theme='light'] &[active="true"] {
    color: #fff !important;
    fill: #fff !important;
  }
`;

const IconWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Badge = styled.span`
  position: absolute;
  top: -6px;
  right: -8px;
  background: linear-gradient(135deg, #ff4444, #ff6b6b);
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
  box-shadow: 0 2px 6px rgba(255, 68, 68, 0.4);
`;

export default BottomNavbar;
