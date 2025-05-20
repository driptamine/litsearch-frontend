import React from "react";
import styled from "styled-components";

// MATERIAL DONE
// import { Box, Typography, makeStyles } from "@mui/material";
import { StyledBox, StyledTypography,   } from "views/styledComponents";

// const useStyles = makeStyles(theme => ({
//   bold: {
//     fontWeight: theme.typography.fontWeightBold
//   }
// }));

const ReStyledTypography = styled(StyledTypography)`
  font-weight: ${props => props.theme.typography.fontWeightBold};
`;


function TextWithLabel({ label, text }) {
  // const classes = useStyles();

  return (
    <StyledBox my={1}>
      <ReStyledTypography
        // className={classes.bold}
      >
        {label}
      </ReStyledTypography>
      {typeof text === "string" ? (<StyledTypography variant="body2">{text}</StyledTypography>) : (text)}
    </StyledBox>
  );
}

export default TextWithLabel;
