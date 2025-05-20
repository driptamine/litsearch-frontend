import React from "react";
import styled from "styled-components";

// import { CardHeader } from "@mui/material";
// import { makeStyles } from "@mui/material/styles";
// import clsx from "clsx";

// const useStyles = makeStyles(theme => ({
//   cardHeader: {
//     padding: theme.spacing(1)
//   },
//   cardTitle: {
//     fontWeight: theme.typography.fontWeightBold
//   }
// }));

const StyledCardHeader = styled.div`
  padding: ${props => props.theme.spacing}
`;


function BaseCardHeader({ className, ...rest }) {
  // const classes = useStyles();

  return (
    <StyledCardHeader
      {...rest}
      // className={clsx(classes.cardHeader, className)}
      titleTypographyProps={{
        variant: "subtitle2",
        // className: classes.cardTitle
      }}
      subheaderTypographyProps={{ variant: "subtitle2" }}
    />
  );
}

export default BaseCardHeader;
