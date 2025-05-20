import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// MATERIAL DONE
// import { makeStyles } from "@mui/material/styles";
// import clsx from "clsx";

import { addKeepScrollState } from "core/hooks/useHistoryPush";

// const useStyles = makeStyles(theme => ({
//   link: {
//     color: "inherit",
//     textDecoration: "inherit"
//   }
// }));

const StyledLink = styled(Link)`
  /* color: inherit;
  text-decoration: inherit; */
`;

const RouterLink = React.forwardRef(
  ({ keepScroll, to, className, ...rest }, ref) => {
    // const classes = useStyles();
    const toProp = keepScroll ? addKeepScrollState(to) : to;

    return (
      <Link
        className={className}
        {...rest}
        ref={ref}
        to={toProp}
      />
    );
  }
);

export default RouterLink;
