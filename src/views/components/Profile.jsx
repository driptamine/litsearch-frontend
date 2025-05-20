import React from "react";
import styled from "styled-components";

// MATERIAL DONE
// import { Box, makeStyles } from "@mui/material";
import { StyledBox } from 'views/styledComponents';
import LoadingIndicator from "./LoadingIndicator";

// const useStyles = makeStyles(theme => ({
//   flexType: {
//     width: "100%",
//   }
// }));

function Profile({ introduction, main, leftSide, rightSide, loading }) {
  // const classes = useStyles();
  return (
    // <LoadingIndicator loading={loading}>
      <StyledBox >
        <StyledBox  padding={1}>{introduction}</StyledBox>
        <StyledBox  display="grid">
          {leftSide && (
            <StyledBox flex={1} flexBasis={240} padding={1}>
              {leftSide}
            </StyledBox>
          )}
          <StyledBox
            // className={classes.flexType}
            flex={10}
            flexBasis={500}
            padding={1}
          >
            {main}
          </StyledBox>
          {rightSide && (
            <StyledBox flex={1} flexBasis={260} padding={1}>
              {rightSide}
            </StyledBox>
          )}
        </StyledBox>
      </StyledBox>
    // </LoadingIndicator>
  );
}

export default Profile;
