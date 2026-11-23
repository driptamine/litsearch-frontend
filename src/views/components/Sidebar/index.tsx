import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import {
  LuChevronRight, LuCompass, LuDisc3, LuFileText, LuFilm, LuHash, LuHouse,
  LuImages, LuLayers3, LuListTodo, LuLogIn, LuMap, LuMessageCircle,
  LuMusic2, LuOrbit, LuPanelLeftClose, LuPanelLeftOpen, LuPencilLine,
  LuShieldCheck, LuUsersRound, LuVideo, LuX,
} from 'react-icons/lu';

import { toggleSidebar } from 'core/reducers/sidebar';
import { useNotifications } from 'core/context/NotificationContext';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import useSelectAuthUser from 'core/hooks/useSelectAuthUser';
import ModalLink from 'views/components/ModalLink';
import './sidebar.css';

const mainLinks = [
  { id: 'UserPosts', to: '/feed', label: 'Feed', icon: LuHouse, exact: true },
  { id: 'Feed', to: '/feed/movies', label: 'Discover', icon: LuCompass },
  { id: 'FYP', to: '/fyp', label: 'For you', icon: LuOrbit },
  { id: 'Messages', to: '/chat/im', label: 'Messages', icon: LuMessageCircle,
    isActive: (_, { pathname }) => pathname.startsWith('/chat/') },
  { id: 'Communities', to: '/communities', label: 'Communities', icon: LuUsersRound, exact: true },
];

const exploreLinks = [
  { id: 'VideosSidebar', to: '/videos', label: 'Videos', icon: LuFilm },
  { id: 'Users', to: '/users', label: 'People', icon: LuUsersRound },
  { id: 'Maps', to: '/maps', label: 'Maps', icon: LuMap },
  { id: 'MapsV2', to: '/mapsv2', label: 'Vector map', icon: LuLayers3 },
];

const workspaceLinks = [
  { id: 'WarpNode', to: '/notes', label: 'NetNode', icon: LuFileText },
  { id: 'JustDoList', to: '/todo', label: 'JustDoList', icon: LuListTodo },
  { id: 'LinkTag', to: '/linktag/all', label: 'LinkTag', icon: LuHash },
];

function assetURL(path) {
  if (!path || /^(https?:|data:|\/\/)/i.test(path)) return path;
  return `${LITLOOP_API_URL}/${path.replace(/^\//, '')}`;
}

function SidebarLinks({ title, items, onNavigate, unreadCount, compact }) {
  return (
    <section className="litloop-sidebar-section" aria-label={title}>
      {title && <h2 className="litloop-sidebar-heading">{title}</h2>}
      <ul>
        {items.map(({ id, to, label, icon: Icon, exact, isActive }) => {
          const unread = id === 'Messages' ? unreadCount : 0;
          const name = unread ? `${label}, ${unread} unread` : label;
          return (
            <li id={id} key={id}>
              <NavLink
                className="litloop-sidebar-link"
                activeClassName="litloop-sidebar-current"
                to={to}
                exact={exact}
                isActive={isActive}
                aria-label={name}
                title={compact ? name : undefined}
                onClick={onNavigate}
              >
                <Icon aria-hidden="true" />
                <span className="litloop-sidebar-label">{label}</span>
                {unread > 0 && (
                  <span className="litloop-sidebar-unread" aria-hidden="true">
                    {unread > 99 ? '99+' : unread}
                  </span>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const Sidebar = ({ mobile = false, drawerOpen = false, onDismiss }) => {
  const expanded = useSelector(state => state.sidebar.sidebar);
  const dispatch = useDispatch();
  const { authUser, isSignedIn } = useSelectAuthUser();
  const { unreadChatCount } = useNotifications();
  const [communities, setCommunities] = useState([]);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const compact = !mobile && !expanded;
  const username = authUser?.username || authUser?.user?.username || authUser?.user__username;
  const profile = username && isSignedIn ? `/${encodeURIComponent(username)}` : null;
  const isUsernameAdmin = isSignedIn && (
    authUser?.is_superuser || authUser?.is_staff ||
    String(username || '').toLowerCase() === 'drip'
  );
  const adminLinks = [
    { id: 'AdminUsernames', to: '/admin/usernames', label: 'Usernames', icon: LuShieldCheck },
  ];
  const avatar = assetURL(authUser?.avatar || authUser?.user?.avatar || authUser?.profileImg);
  const navigate = mobile ? onDismiss : undefined;

  useEffect(() => {
    if (!isSignedIn) {
      setCommunities([]);
      return;
    }
    const load = new AbortController();
    axios.get(`${LITLOOP_API_URL}/communities/`, { headers: authHeader(), signal: load.signal })
      .then(({ data }) => setCommunities((data.communities || []).filter(community => community.user_is_member)))
      .catch(() => {});
    return () => load.abort();
  }, [isSignedIn, username]);

  useEffect(() => {
    if (!mobile || !drawerOpen) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    toggleRef.current?.focus();

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onDismiss();
      }
      if (event.key !== 'Tab') return;
      const focusable = panelRef.current?.querySelectorAll('a[href], button:not([disabled])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [mobile, drawerOpen, onDismiss]);

  if (mobile && !drawerOpen) return null;

  const library = profile ? [
    { id: 'Music', to: `${profile}/tracks`, label: 'My music', icon: LuMusic2 },
    { id: 'Albums', to: `${profile}/albums`, label: 'My albums', icon: LuDisc3 },
    { id: 'Photos', to: `${profile}/photos`, label: 'My photos', icon: LuImages },
    { id: 'Videos', to: `${profile}/videos`, label: 'My videos', icon: LuVideo },
  ] : [];

  return (
    <>
      {mobile && <div className="litloop-sidebar-scrim" onClick={onDismiss} aria-hidden="true" />}
      <aside
        ref={panelRef}
        id="litloop-sidebar"
        className="litloop-sidebar"
        data-compact={compact}
        data-mobile={mobile}
        role={mobile ? 'dialog' : undefined}
        aria-modal={mobile ? true : undefined}
        aria-label="LitLoop navigation"
      >
        <div className="litloop-sidebar-top">
          <Link className="litloop-sidebar-brand" to="/" onClick={navigate} aria-label="LitLoop home" title={compact ? 'LitLoop' : undefined}>
            <span className="litloop-sidebar-mark"><img src={`${import.meta.env.BASE_URL}purple-tiny-favicon.png`} alt="" /></span>
            <span className="litloop-sidebar-brand-label">LitLoop</span>
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="litloop-sidebar-toggle"
            onClick={mobile ? onDismiss : () => dispatch(toggleSidebar())}
            aria-label={mobile ? 'Close navigation' : compact ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={mobile ? undefined : expanded}
            aria-controls={mobile ? undefined : 'litloop-sidebar-links'}
            title={mobile ? 'Close navigation' : compact ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {mobile ? <LuX aria-hidden="true" /> : compact ? <LuPanelLeftOpen aria-hidden="true" /> : <LuPanelLeftClose aria-hidden="true" />}
          </button>
        </div>

        <div className="litloop-sidebar-action">
          <ModalLink className="litloop-sidebar-link litloop-sidebar-create" to="/create_post" onClick={navigate} aria-label="Create post" title={compact ? 'Create post' : undefined}>
            <LuPencilLine aria-hidden="true" />
            <span className="litloop-sidebar-label">Create post</span>
          </ModalLink>
        </div>

        <nav id="litloop-sidebar-links" aria-label="Main navigation" className="litloop-sidebar-links">
          <SidebarLinks items={mainLinks} unreadCount={unreadChatCount} onNavigate={navigate} compact={compact} />
          {!compact && isSignedIn && communities.length > 0 && (
            <section className="litloop-sidebar-section litloop-sidebar-communities" aria-label="Your communities">
              <h2 className="litloop-sidebar-heading">Your communities</h2>
              <ul>
                {communities.map(({ id, handle, icon, name }) => (
                  <li key={id}>
                    <NavLink className="litloop-sidebar-link" activeClassName="litloop-sidebar-current" to={`/communities/@${encodeURIComponent(handle)}`} onClick={navigate}>
                      <span className="litloop-sidebar-community-icon" aria-hidden="true">
                        {icon ? <img src={assetURL(icon)} alt="" /> : name.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="litloop-sidebar-label">{name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <SidebarLinks title="Explore" items={profile ? exploreLinks : [
            ...exploreLinks, { id: 'Music', to: '/musicv2', label: 'Music', icon: LuMusic2 },
          ]} onNavigate={navigate} compact={compact} />
          <SidebarLinks title="Workspace" items={workspaceLinks} onNavigate={navigate} compact={compact} />
          {profile && <SidebarLinks title="Library" items={library} onNavigate={navigate} compact={compact} />}
          {isUsernameAdmin && <SidebarLinks title="Admin" items={adminLinks} onNavigate={navigate} compact={compact} />}
        </nav>

        <div className="litloop-sidebar-footer">
          <Link className="litloop-sidebar-link litloop-sidebar-account" to={profile || '/login'} onClick={navigate} aria-label={profile ? `Open profile for ${username}` : 'Log in'} title={compact ? (profile ? username : 'Log in') : undefined}>
            <span className="litloop-sidebar-avatar" aria-hidden="true">
              {profile ? username.slice(0, 1).toUpperCase() : <LuLogIn />}
              {profile && avatar && <img src={avatar} alt="" onError={event => { event.currentTarget.hidden = true; }} />}
            </span>
            <span className="litloop-sidebar-label">{profile ? username : 'Log in'}</span>
            <LuChevronRight className="litloop-sidebar-account-arrow" aria-hidden="true" />
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
