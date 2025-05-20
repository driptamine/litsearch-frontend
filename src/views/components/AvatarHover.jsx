import React, {useState} from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

// MATERIAL DONE
// import { withStyles } from '@mui/material/styles';
// import { IconButton, Avatar, Button, Menu, MenuItem, ListItem, ListItemIcon, ListItemText } from "@mui/material";
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

// import MenuIcon from "@mui/icons-material/Menu";
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import DraftsIcon from '@mui/icons-material/Drafts';
// import SendIcon from '@mui/icons-material/Send';
// import FavoriteIcon from '@mui/icons-material/Favorite';
import { StyledMenuIcon, StyledInboxIcon, StyledDraftsIcon, StyledSendIcon, StyledFavoriteIcon } from 'views/styledComponents/icons';

// VIEWS
import RouterLink from "views/components/RouterLink";
import DropdownV2 from "views/components/Dropdown/DropdownV2";
import ModalLink from "views/components/ModalLink";

// CORE
import { toggleDrawer } from "core/actions";
import ListItemWithAvatarFromSpotify from "views/components/ListItemWithAvatarFromSpotify";
import { getState } from "core/store";
import { fetchLogout } from "core/actions";

// const StyledMenuOld = withStyles({
//   paper: {
//     border: '1px solid #d3d4d5',
//   },
// })((props) => (
//   <Menu
//     elevation={0}
//     getContentAnchorEl={null}
//     anchorOrigin={{
//       vertical: 'bottom',
//       horizontal: 'center',
//     }}
//     transformOrigin={{
//       vertical: 'top',
//       horizontal: 'center',
//     }}
//     {...props}
//   />
// ));
//
// const StyledMenuItemOld = withStyles((theme) => ({
//   root: {
//     '&:focus': {
//       backgroundColor: theme.palette.primary.main,
//       '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
//         color: theme.palette.common.white,
//       },
//     },
//   },
// }))(MenuItem);






const StyledFlex = styled.div`
  display: flex;
  margin-right: 2em;
`;

const StyledImg = styled.img`
  width: 40px;
  border-radius: 30px;
  cursor: pointer;
  user-select: none;
`;
const LoginWrapper = styled.div`
  padding-right: 1em;
`;

const LoginBtn = styled(ModalLink)`
  display: flex;
  font-family: Verdana;
  color: white;
  /* background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%); */
  background: linear-gradient(45deg, #673ab7 30%, #3f51b5 90%);


  /* box-shadow: 0 3px 5px 2px rgba(255, 105, 135, .3); */

  width: 52px;
  border-radius: 13px;
  padding: 12px 23px;
  text-decoration: none;

`;

function AvatarHover({avatarUrl}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();


  const authUser = getState().users.access_token
  const oauthed = getState().users.google_oauth.profileImg;
  const oauthed_img = getState().users.profileImg;


  function handleClick() {
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
  // const authUser = getState().users

  const is_oauth = () => {
    if(oauthed) {
      return <StyledImg src={oauthed || null} alt="dablee"/>
    } else if (authUser){
      return <StyledAvatar src={avatarUrl ? `http://localhost:8000${avatarUrl}` : null}  variant={"circular"} alt="daMN" />
    } else {
      return (
        <LoginWrapper>
          <LoginBtn
            variant="contained"
            to="/login"
            >Log In
          </LoginBtn>
        </LoginWrapper>
      )
    }
  }
  return (
    <StyledFlex className="AvatarHoverz">
      {/*<Button onClick={handleClick}>
        <Avatar src={avatarUrl}  variant={"circle"} />


      </Button>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>*/}

      {/*<StyledIconButton
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
      >


      </StyledIconButton>*/}


      {/*<StyledImg src={oauthed || null} />*/}
      {is_oauth()}
      {/*<DropdownV2 />*/}

      {/*<StyledIconButton onClick={handleLogOut}>Logout</StyledIconButton>*/}


      {/*<StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem>
          <StyledListItemIcon>
            <StyledSendIcon fontSize="small" />
          </StyledListItemIcon>
          <StyledListItemText primary="My Profile" />
        </StyledMenuItem>
        { authUser.access_token &&
          <StyledListItem button to={'/liked'} component={RouterLink}>
            <StyledListItemIcon><StyledFavoriteIcon/></StyledListItemIcon>
            <StyledListItemText primary={"Liked"}>Liked</StyledListItemText>
          </StyledListItem>
        }
        <StyledMenuItem>
          <StyledListItemIcon>
            <StyledDraftsIcon fontSize="small" />
          </StyledListItemIcon>
          <StyledListItemText primary="Liked" />
        </StyledMenuItem>

        <StyledMenuItem>
          <StyledListItemIcon>
            <StyledInboxIcon fontSize="small" />
          </StyledListItemIcon>
          <StyledListItemText primary="Logout" />
        </StyledMenuItem>

      </StyledMenu>*/}
    </StyledFlex>

  );
}

export default AvatarHover;
