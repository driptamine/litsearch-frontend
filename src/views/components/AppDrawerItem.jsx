import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

// MATERIAL DONE
// import { ListItemIcon, ListItemText, ListItem } from "@mui/material";
import RouterLink from "views/components/RouterLink";

const StyledListItem = styled.li`

`;
const StyledListItemText = styled.div`

`;
const StyledListItemIcon = styled.div`

`;

function AppDrawerItem({ to, icon, title }) {
  const location = useLocation();

  return (
    <StyledListItem
      button
      to={to}
      component={RouterLink}
      selected={location.pathname === to}
    >
      <StyledListItemIcon>{icon}</StyledListItemIcon>
      <StyledListItemText primary={title} />
    </StyledListItem>
  );
}

export default AppDrawerItem;
