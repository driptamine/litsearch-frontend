import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@linaria/react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaMusic, FaImage, FaFilm, FaSearch, FaRocket, FaUsers, FaHashtag } from 'react-icons/fa';
import { MdAlbum } from 'react-icons/md';
import { TbMessageCircle } from 'react-icons/tb';
import { BsFillFileRichtextFill, BsGrid3X3Gap as AppsGrid } from 'react-icons/bs';
import { LuLayoutList } from 'react-icons/lu';
import { useNotifications } from 'core/context/NotificationContext';

const BottomNavbar = () => {
  const { pathname } = useLocation();
  const username = useSelector((state) => state.users?.username || state.users?.user__username);
  const { unreadChatCount } = useNotifications();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  const navItems = [
    { icon: <FaHome size={20} />, label: 'Feed', path: '/feed' },
    { icon: <FaRocket size={20} />, label: 'FYP', path: '/fyp' },
    { icon: <FaMusic size={20} />, label: 'tracks', path: `/${username}/tracks` },
    { icon: <BsFillFileRichtextFill size={20} />, label: 'Notes', path: '/notes' },
    { icon: <LuLayoutList size={20} />, label: 'Todo', path: '/todo' },
    { icon: <AppsGrid size={20} />, label: 'AppsGrid', more: true },
    { icon: <TbMessageCircle size={20} />, label: 'Chat', path: '/chat/im', badge: unreadChatCount },
    { icon: <FaSearch size={20} />, label: 'Search', path: '/' },
    { icon: <FaUsers size={20} />, label: 'Users', path: '/users' },
    { icon: <FaHashtag size={20} />, label: 'LinkTag', path: '/linktag/all' },
    { icon: <FaUsers size={20} />, label: 'Communities', path: '/communities' },
    { icon: <FaMusic size={20} />, label: 'Music', path: '/musicv2' },
    { icon: <MdAlbum size={20} />, label: 'Albums', path: `/${username}/albums` },
    { icon: <FaImage size={20} />, label: 'Photos', path: `/${username}/photos` },
    { icon: <FaFilm size={20} />, label: 'Videos', path: `/${username}/videos` },

  ];

  return (
    <Wrapper ref={menuRef}>
      {showMenu && (
        <GridOverlay>
          <GridContainer>
            {navItems.filter((i) => !i.more).map((item) => (
              <GridItem key={item.label} to={item.path} onClick={() => setShowMenu(false)}>
                {item.icon}
                <GridLabel>{item.label}</GridLabel>
              </GridItem>
            ))}
          </GridContainer>
        </GridOverlay>
      )}
      <Tabbar>
        {navItems.map((item) => (
          item.more ? (
            <MoreButton key="more" active={showMenu} onClick={() => setShowMenu((v) => !v)}>
              {item.icon}
            </MoreButton>
          ) : (
            <TabItem key={item.path} to={item.path} active={pathname === item.path}>
              <IconWrap>
                {item.icon}
                {item.badge > 0 && <Badge>{item.badge > 99 ? '99+' : item.badge}</Badge>}
              </IconWrap>
            </TabItem>
          )
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
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  max-width: 100%;
  height: 60px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  border-radius: 50px;
  padding: 0 8px;
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
  flex-shrink: 0;
  min-width: 48px;
  padding: 0 8px;
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

const GridOverlay = styled.div`
  position: fixed;
  bottom: 84px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 24px);
  max-width: 400px;
  z-index: 999;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 16px 12px;
  border-radius: 20px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(0, 0, 0, 0.35);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    0 -4px 24px rgba(0, 0, 0, 0.3);

  [data-theme='light'] & {
    background: rgba(255, 255, 255, 0.75);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.5),
      0 -4px 24px rgba(0, 0, 0, 0.08);
  }
`;

const GridItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 4px;
  border-radius: 12px;
  text-decoration: none;
  color: #fff !important;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    color: #fff !important;
    fill: #fff !important;
  }

  [data-theme='light'] & {
    color: #000 !important;
    svg { color: #000 !important; fill: #000 !important; }
  }
`;

const GridLabel = styled.span`
  font-size: 9px;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
`;

const MoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 48px;
  padding: 0 8px;
  height: 100%;
  border: none;
  background: none;
  color: #fff !important;
  cursor: pointer;
  opacity: ${({ active }) => (active ? 0.7 : 0.5)};
  transition: opacity 0.15s;

  svg {
    color: #fff !important;
    fill: #fff !important;
  }
`;

export default BottomNavbar;
