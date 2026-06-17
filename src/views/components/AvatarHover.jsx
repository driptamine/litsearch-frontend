import React, { useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';

import { styled } from '@linaria/react';

// MATERIAL DONE
// import { withStyles } from '@mui/material/styles';
// import { IconButton, Avatar, Button, Menu, MenuItem, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  StyledIconButton,
  StyledAvatar,
  StyledButton,
  StyledMenu,
  StyledMenuItem,
  StyledListItem,
  StyledListItemIcon,
  StyledListItemText
} from 'views/styledComponents';

// import MenuIcon from '@mui/icons-material/Menu';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import DraftsIcon from '@mui/icons-material/Drafts';
// import SendIcon from '@mui/icons-material/Send';
// import FavoriteIcon from '@mui/icons-material/Favorite';
import { StyledMenuIcon, StyledInboxIcon, StyledDraftsIcon, StyledSendIcon, StyledFavoriteIcon } from 'views/styledComponents/icons';

// VIEWS
import RouterLink from 'views/components/RouterLink';
import DropdownV2 from 'views/components/Dropdown/DropdownV2';
import ModalLink from 'views/components/ModalLink';

// CORE
import { toggleDrawer, fetchLogout } from 'core/actions';
import ListItemWithAvatarFromSpotify from 'views/components/ListItemWithAvatarFromSpotify';
import { getState } from 'core/store';
import { LITLOOP_API_URL } from 'core/constants/urls';

const StyledFlex = styled.div`
  display: flex;
  align-items: center;
`;

const AvatarCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const LoginWrapper = styled.div`
  padding-right: 1em;
`;

const LoginBtn = styled(ModalLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: Verdana;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  background: #686cb9;
  border-radius: 24px;
  padding: 8px 20px;
  text-decoration: none;
  white-space: nowrap;
`;

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

function AvatarHover({avatarUrl}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [imgError, setImgError] = useState(false);
  const user = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const getBestAvatar = (data) => {
    if (!data) return null;
    return data.djangoAvatar || 
           data.avatar || 
           data.user?.avatar || 
           data.profile_img || 
           data.avatar_url || 
           data.user?.profile_img || 
           data.user?.avatar_url;
  };

  const djangoAvatar = getBestAvatar(user);
  const oauthAvatar = user.profileImg || user.google_oauth?.profileImg || user.google?.profileImg;
  
  const finalAvatarUrl = djangoAvatar || avatarUrl || oauthAvatar;

  const access_token = user.access_token;
  const isOauthed = user.accounts?.some(a => a[user.service]?.oauthed) || user.oauthed;

  const handleClick = () => {
    dispatch(toggleDrawer());
  }

  const handleClickz = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleLogOut(){
    dispatch(fetchLogout())
  }

  const renderAvatarOrLogin = () => {
    const isSignedIn = !!user.access_token || !!user.isAuthorized;
    if (!isSignedIn) {
      return (
        <LoginWrapper>
          <LoginBtn variant="contained" to="/login">
            Log In
          </LoginBtn>
        </LoginWrapper>
      );
    }

    const url = finalAvatarUrl || DEFAULT_AVATAR;
    if (!imgError) {
      const isAbsolute = String(url).startsWith('http://') || 
                         String(url).startsWith('https://') || 
                         String(url).startsWith('//') || 
                         String(url).startsWith('data:');
      let src = url;
      if (!isAbsolute) {
        src = `${LITLOOP_API_URL}${String(url).startsWith('/') ? '' : '/'}${url}`;
      } else if (String(url).startsWith('//')) {
        src = `https:${url}`;
      }
      return (
        <AvatarCircle>
          <AvatarImg src={src} alt="User Avatar" onError={() => setImgError(true)} />
        </AvatarCircle>
      );
    }

    return (
      <AvatarCircle>
        <AvatarImg src={DEFAULT_AVATAR} alt="User Avatar" />
      </AvatarCircle>
    );
  };

  return (
    <StyledFlex className="AvatarHoverz">
      {renderAvatarOrLogin()}
    </StyledFlex>
  );
}

export default AvatarHover;
