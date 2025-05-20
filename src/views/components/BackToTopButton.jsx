// import React from "react";
//
// // MATERIAL DONE
// // import { Fab, Grow, useScrollTrigger } from "@mui/material";
// import { StyledFab, StyledGrow } from "@mui/material";
// // import { makeStyles } from "@mui/material/styles";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
//
// const THRESHOLD = 300;
//
// function handleClick() {
//   window.scroll({
//     top: 0,
//     left: 0,
//     behavior: "smooth"
//   });
// }
//
// // const useStyles = makeStyles(theme => ({
// //   fab: {
// //     position: "fixed",
// //     bottom: 20,
// //     right: 20,
// //     zIndex: theme.zIndex.appBar
// //   }
// // }));
//
// function BackToTopButton() {
//   // const classes = useStyles();
//   const trigger = useScrollTrigger({
//     disableHysteresis: true,
//     threshold: THRESHOLD
//   });
//
//   return (
//     <Grow in={trigger}>
//       <Fab className={classes.fab} color="secondary" onClick={handleClick}>
//         <KeyboardArrowUpIcon fontSize="large" />
//       </Fab>
//     </Grow>
//   );
// }
//
// export default BackToTopButton;
