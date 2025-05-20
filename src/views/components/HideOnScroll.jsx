import React from "react";
import styled from "styled-components";

// MATERIAL UNDONE
// import useScrollTrigger from "@mui/material/useScrollTrigger";
// import Slide from "@mui/material/Slide";


const StyledSlide = styled.div`

`;

function HideOnScroll({ children }) {
  // const trigger = useScrollTrigger();

  return (
    <StyledSlide
      appear={false}
      direction="down"
      // in={!trigger}
    >
      {children}
    </StyledSlide>
  );
}

export default HideOnScroll;
