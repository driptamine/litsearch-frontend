import React from "react";

// MATERIAL DONE
// import { Card, CardActionArea, CardContent } from "@mui/material";
// import { makeStyles } from "@mui/material/styles";

import styled from "styled-components";

// import clsx from "clsx";

// const useStyles = makeStyles(theme => ({
//   card: {
//     backgroundColor: "transparent"
//   },
//   cardContent: {
//     padding: 0
//   }
// }));


const StyledCardContent = styled.div`
  padding: 0;
`;
const StyledCard = styled.div`
  background-color: transparent;
`;
const StyledCardActionArea = styled.div`

`;


function BaseCard({ hasActionArea, className, children, ...rest }) {
  // const classes = useStyles();

  const content = (
    <StyledCardContent
      // className={classes.cardContent}
      >
      {children}
    </StyledCardContent>
  );

  return (
    <StyledCard
      elevation={0}
      // className={clsx(classes.card, className)}
      {...rest}
    >
      {hasActionArea ? <StyledCardActionArea>{content}</StyledCardActionArea> : { content }}
    </StyledCard>
  );
}

export default BaseCard;
