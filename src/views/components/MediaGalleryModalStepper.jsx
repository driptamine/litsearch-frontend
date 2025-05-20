import React from "react";
import styled, { css } from "styled-components";
// MATERIAL UNDONE
// import { Box, makeStyles } from "@mui/material";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";


import { StyledBox } from "views/styledComponents";
import { StyledChevronLeftIcon, StyledChevronRightIcon } from "views/styledComponents/icons";


const SIZE = 60;

// const useStyles = makeStyles(theme => ({
//   stepper: {
//     position: "absolute",
//     top: "50%",
//     marginTop: -SIZE / 2,
//     width: SIZE,
//     height: SIZE,
//     cursor: "pointer",
//     opacity: 0.4,
//     "&:hover": {
//       opacity: 0.7
//     }
//   },
//   stepperIcon: {
//     fontSize: theme.typography.h2.fontSize
//   }
// }));

const ReStyledBox = styled(StyledBox)`
  position: absolute;
  top: 50%;
  margin-top: ${-SIZE / 2};
  width: ${SIZE};
  height: ${SIZE};
  cursor: pointer;
  opacity: 0.4;
  &:hover: {
    opacity: 0.7;
  }
  ${props => props.justifyContent === 'flex-start' ? css`
    justify-content: flex-start;
  ` : css`
    justify-content: flex-end;
  `}
`;
function MediaGalleryModalStepper({ onClickPrevious, onClickNext }) {
  // const classes = useStyles();

  return (
    <>
      {onClickPrevious && (
        <StyledBox
          // className={classes.stepper}
          left={0}
          justifyContent="flex-start"
          onClick={onClickPrevious}
        >
          <StyledChevronLeftIcon
            // className={classes.stepperIcon}
          />
        </StyledBox>
      )}
      {onClickNext && (
        <StyledBox
          // className={classes.stepper}
          right={0}
          justifyContent="flex-end"
          onClick={onClickNext}
        >
          <StyledChevronRightIcon
            // className={classes.stepperIcon} 
          />
        </StyledBox>
      )}
    </>
  );
}

export default MediaGalleryModalStepper;
