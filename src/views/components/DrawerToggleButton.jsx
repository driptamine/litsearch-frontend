import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

// MATERIAL DONE
// import { IconButton } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
import { toggleDrawer } from "core/actions";

const StyledIconButton = styled.div`

`;
const StyledMenuIcon = styled.div`

`;

function DrawerToggleButton() {
  const dispatch = useDispatch();

  function handleClick() {
    dispatch(toggleDrawer());
  }

  return (
    <StyledIconButton onClick={handleClick}>
      <StyledMenuIcon />
    </StyledIconButton>
  );
}

export default DrawerToggleButton;
