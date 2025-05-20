import React from "react";
// import { CircularProgress, Box } from "@mui/material";
import { StyledCircularProgress, StyledBox } from 'views/styledComponents';

function LoadingIndicator({ loading, children }) {
  if (loading) {
    return (
      <StyledBox display="flex" justifyContent="center" my={2} flexGrow={1}>
        <StyledCircularProgress size={48}>LOADING</StyledCircularProgress>
      </StyledBox>
    );
  }

  return children || null;
}

export default LoadingIndicator;
