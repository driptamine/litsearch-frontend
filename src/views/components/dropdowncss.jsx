import React from 'react';
import styled from 'styled-components';

// MATERIAL UNDONE
// import { withStyles } from '@mui/material/styles';
// import Button from '@mui/material/Button';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import DraftsIcon from '@mui/icons-material/Drafts';
// import SendIcon from '@mui/icons-material/Send';

import {
  StyledButton,
  StyledMenu,
  StyledMenuItem,
  StyledListItemIcon,
  StyledListItemText,
  StyledInboxIcon,
  StyledDraftsIcon,
  StyledSendIcon,
} from 'views/styledComponents/icons';

// const StyledMenu = withStyles({
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

// const StyledMenuItem = withStyles((theme) => ({
//   root: {
//     '&:focus': {
//       backgroundColor: theme.palette.primary.main,
//       '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
//         color: theme.palette.common.white,
//       },
//     },
//   },
// }))(MenuItem);

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        Open Menu
      </Button>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem>
          <StyledListItemIcon>
            <SendIcon fontSize="small" />
          </StyledListItemIcon>
          <StyledListItemText primary="Sent mail" />
        </StyledMenuItem>

        <StyledMenuItem>
          <StyledListItemIcon>
            <StyledDraftsIcon fontSize="small" />
          </StyledListItemIcon>
          <StyledListItemText primary="Drafts" />
        </StyledMenuItem>

        <StyledMenuItem>
          <StyledListItemIcon>
            <StyledInboxIcon fontSize="small" />
          </StyledListItemIcon>
          <StyledListItemText primary="Inbox" />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}
