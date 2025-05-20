import React from "react";
import styled from 'styled-components';
// MATERIAL DONE
// import { CircularProgress, Avatar, makeStyles, colors } from "@mui/material";
import { StyledCircularProgress, StyledAvatar } from 'views/styledComponents';

// const useStyles = makeStyles(theme => ({
//   avatar: {
//     width: 46,
//     height: 46,
//     backgroundColor: colors.common.white
//   },
//   value: theme.typography.button,
//   percent: {
//     fontSize: "50%"
//   }
// }));
const RatingNumber = styled.span`
  color: ${props => props.theme.text};
  font-family: Helvetica;
  margin-left: 30px;
  margin-right: 30px;
`;
function Rating({ value }) {
  // const classes = useStyles();

  return (
    <div
      // className={classes.avatar}
    >
      {/*<CircularProgress
        style={{ position: "absolute" }}
        variant="static"
        value={value}
        color="primary"
        thickness={4}
      />*/}
      <RatingNumber
        // className={classes.value}
      >
        {value}
        {/*<sup className={classes.percent}>%</sup>*/}
      </RatingNumber>
    </div>
  );
}

export default Rating;
