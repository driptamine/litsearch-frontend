import React from "react";
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

function Rating({ value }) {
  // const classes = useStyles();

  return (
    <StyledAvatar
      // className={classes.avatar}
    >
      <StyledCircularProgress
        style={{ position: "absolute" }}
        variant="static"
        value={value}
        color="primary"
        thickness={4}
      />
      <span className="value">
        {value}
        <sup className="percent">%</sup>
      </span>
    </StyledAvatar>
  );
}

export default Rating;
