import React from 'react';
import { styled } from '@linaria/react'

// MATERIAL DONE
// import { makeStyles } from '@mui/material';

export const getAspectRatioString = (width, height) => `${width}:${height}`;

// const useStyles = makeStyles(theme => ({
//   root: {
//     overflow: "hidden",
//     position: "relative",
//     height: ({ paddingTop }) => (paddingTop ? 0 : undefined),
//     paddingTop: ({ paddingTop }) => paddingTop,
//     "& > *": {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%"
//     }
//   }
// }));

const styledDivStyles = props => `
  height: ${props.paddingTop ? 0 : undefined};
  padding-top: ${props.paddingTop};
`;

const StyledDiv = styled.div`
  overflow: hidden;
  position: relative;
  ${styledDivStyles}
  & > * : {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const AspectRatio = ({ aspectRatio, children }, ref) => {
  const [ratioX, ratioY] = aspectRatio.split(":").map(ratio => parseInt(ratio));
  const ratio = (100 * ratioY) / ratioX;
  const paddingTop = isNaN(ratio) ? undefined : `${ratio}%`;

  // const classes = useStyles({ paddingTop });

  return (
    <StyledDiv ref={ref}>
      {children}
    </StyledDiv>
  );
};

export default React.forwardRef(AspectRatio);
