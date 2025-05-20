import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

// MATERIAL DONE
// import { Drawer, List } from "@mui/material";
// import { makeStyles } from "@mui/material/styles";
// import MovieIcon from "@mui/icons-material/LocalMovies";
// import PersonIcon from "@mui/icons-material/RecentActors";
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import { ListItemIcon, ListItemText, ListItem } from "@mui/material";
import { StyledList, StyledListItem, StyledListItemIcon, StyledListItemText,  } from 'views/styledComponents';

import { selectors } from "core/reducers/index";
import { toggleDrawer, fetchLogout } from "core/actions";
import useSelectAuthUser from "core/hooks/useSelectAuthUser";
import { getState } from 'core/store';



import AppDrawerItem from "views/components/AppDrawerItem";
import RouterLink from "views/components/RouterLink";

// const useStyles = makeStyles(theme => ({
//   drawerPaper: {
//     width: 240
//   }
// }));

const StyledDrawer = styled.div`

`;


const StyledMovieIcon = styled.div`

`;
const StyledPersonIcon = styled.div`

`;
const StyledExitToAppIcon = styled.div`

`;
const StyledFavoriteIcon = styled.div`

`;

function AppDrawer() {
  // const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();
  const isOpen = useSelector(state => selectors.selectIsDrawerOpen(state));
  const prevLocation = useRef();

  useEffect(() => {
    if (location !== prevLocation.current && isOpen) {
      dispatch(toggleDrawer());
    }
  }, [location, isOpen, dispatch]);

  useEffect(() => {
    prevLocation.current = location;
  });

  function handleClose() {
    dispatch(toggleDrawer());
  }

  function handleLogOut(){
    dispatch(fetchLogout())
  }

  const authUser = getState().users
  // const { isSignedIn, isFetching, authUser } = useSelectAuthUser();

  return (
    <StyledDrawer
      open={isOpen}
      anchor="right"
      // classes={{ paper: classes.drawerPaper }}
      onClose={handleClose}
    >
      <StyledList>
        { authUser.access_token &&
          <StyledListItem
            button
            to={'/liked'}
            component={RouterLink}

          >
            <StyledListItemIcon><StyledFavoriteIcon/></StyledListItemIcon>
            <StyledListItemText primary={"Liked"} />
          </StyledListItem>
        }

        { authUser.access_token &&
          <StyledListItem
            button
            to={'/movies'}
            component={RouterLink}
            onClick={handleLogOut}
          >
            <StyledListItemIcon><StyledExitToAppIcon/></StyledListItemIcon>
            <StyledListItemText primary={"Logout"} />
          </StyledListItem>
        }

        { !authUser.access_token &&
          <StyledListItem
            button
            to={'/login'}
            component={RouterLink}

          >
            <StyledListItemIcon><StyledExitToAppIcon/></StyledListItemIcon>
            <StyledListItemText primary={"SignIn"} />
          </StyledListItem>
        }
      </StyledList>
    </StyledDrawer>
  );
}

export default AppDrawer;
