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

type NavLink = { icon: React.ReactNode; label: string; path: string; badge?: number };

const BottomNavbar = () => {
  const { pathname } = useLocation();
  const username = useSelector((state: { users?: { username?: string; user__username?: string } }) => (
    state.users?.username || state.users?.user__username
  ));
  const { unreadChatCount } = useNotifications();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setShowMenu(false), [pathname]);

  useEffect(() => {
    if (!showMenu) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setShowMenu(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setShowMenu(false);
      moreRef.current?.focus();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showMenu]);

  const more = { icon: <AppsGrid size={20} />, label: 'More' };
  const navItems: (NavLink | typeof more)[] = [
    { icon: <FaHome size={20} />, label: 'Feed', path: '/feed' },
    { icon: <FaRocket size={20} />, label: 'FYP', path: '/fyp' },
    ...(username ? [{ icon: <FaMusic size={20} />, label: 'Tracks', path: `/${username}/tracks` }] : []),
    { icon: <BsFillFileRichtextFill size={20} />, label: 'Notes', path: '/notes' },
    { icon: <LuLayoutList size={20} />, label: 'Todo', path: '/todo' },
    more,
    { icon: <TbMessageCircle size={20} />, label: 'Chat', path: '/chat/im', badge: unreadChatCount },
    { icon: <FaSearch size={20} />, label: 'Search', path: '/' },
    { icon: <FaUsers size={20} />, label: 'Users', path: '/users' },
    { icon: <FaHashtag size={20} />, label: 'LinkTag', path: '/linktag/all' },
    { icon: <FaUsers size={20} />, label: 'Communities', path: '/communities' },
    { icon: <FaMusic size={20} />, label: 'Music', path: '/musicv2' },
    ...(username ? [
      { icon: <MdAlbum size={20} />, label: 'Albums', path: `/${username}/albums` },
      { icon: <FaImage size={20} />, label: 'Photos', path: `/${username}/photos` },
      { icon: <FaFilm size={20} />, label: 'Videos', path: `/${username}/videos` },
    ] : []),
  ];
  return (
    <Wrapper ref={menuRef} aria-label="Main navigation" data-menu-open={showMenu ? '' : undefined}>
      <Tabbar>
        {navItems.map((item) => (
          'path' in item ? (
            <TabItem
              key={item.path}
              to={item.path}
              aria-label={item.label}
              aria-current={pathname === item.path ? 'page' : undefined}
              onClick={() => setShowMenu(false)}
            >
              <IconWrap>
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge>{item.badge > 99 ? '99+' : item.badge}</Badge>
                )}
              </IconWrap>
            </TabItem>
          ) : (
            <MoreButton
              key="more"
              ref={moreRef}
              type="button"
              aria-label={item.label}
              aria-expanded={showMenu}
              onClick={() => setShowMenu((open) => !open)}
            >
              {item.icon}
            </MoreButton>
          )
        ))}
      </Tabbar>
      {showMenu && (
        <GridOverlay>
          <GridContainer>
            {navItems.filter((item): item is NavLink => 'path' in item).map((item) => (
              <GridItem key={item.path} to={item.path} onClick={() => setShowMenu(false)}>
                {item.icon}
                <GridLabel>{item.label}</GridLabel>
              </GridItem>
            ))}
          </GridContainer>
        </GridOverlay>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  position: fixed;
  bottom: var(--litloop-bottom-nav-bottom);
  left: 0;
  width: 100%;
  z-index: 1000;
  display: none;
  justify-content: center;
  padding: 0 12px;
  pointer-events: none;

  @media (max-width: 768px) {
    display: flex;
  }

  &[data-menu-open] {
    z-index: 1002;
  }
`;

const Tabbar = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  max-width: 100%;
  height: var(--litloop-bottom-nav-height);
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
  color: #fff;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 1px 1px rgba(255, 255, 255, 0.06),
    inset -1px -1px rgba(255, 255, 255, 0.06),
    0 -4px 24px rgba(0, 0, 0, 0.3);
  pointer-events: auto;

  [data-theme='light'] & {
    background: rgba(255, 255, 255, 0.65);
    color: #363537;
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
  color: inherit !important;
  font-size: 10px;
  height: 100%;
  position: relative;
  &[aria-current='page'] svg {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
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
  bottom: calc(var(--litloop-bottom-nav-top) + 12px);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 24px);
  max-width: 400px;
  z-index: 999;
  pointer-events: auto;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-height: calc(100dvh - var(--litloop-bottom-nav-top) - 24px);
  overflow-y: auto;
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 48px;
  padding: 0 8px;
  height: 100%;
  border: none;
  background: none;
  color: inherit;
  font-size: 10px;
  cursor: pointer;
`;

export default BottomNavbar;
