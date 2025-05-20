import React, { useState, useEffect } from "react";
import { useTrackVisibility } from "react-intersection-observer-hook";

// MATERIAL UNDONE
// import { Box, useTheme } from "@mui/material";
import { StyledBox } from 'views/styledComponents';
// import { makeStyles } from "@mui/material/styles";

import placeholderPng from "views/assets/placeholder.png";
import LoadingIndicator from "./LoadingIndicator";
import AspectRatio, { getAspectRatioString } from "./AspectRatio";

const ORIGINAL = "original";
const DEFAULT_ALT = "Not Loaded";
const DEFAULT_ASPECT_RATIO = getAspectRatioString(1, 1);

// const useStyles = makeStyles(theme => ({
//   imgWrapper: {
//     display: "block",
//     // backgroundColor: theme.palette.background.default,
//     backgroundColor: "#16181c"
//   },
//   img: {
//     width: "100%",
//     height: "100%",
//     objectFit: ({ objectFit }) => objectFit
//   }
// }));

function BaseImage({
  src,
  alt = DEFAULT_ALT,
  aspectRatio = ORIGINAL,
  lazyLoad = true,
  objectFit = "contain",
  showFallbackWhileLoading
}) {
  const classes = useStyles({ objectFit });
  const theme = useTheme();
  const [imgHeight, setImgHeight] = useState();
  const [imgWidth, setImgWidth] = useState();
  const [ref, { isVisible }] = useTrackVisibility();
  const [lazyLoaded, setLazyLoaded] = useState(isVisible);
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const isOriginalAspectRatio = aspectRatio === ORIGINAL;

  function handleLoad(e) {
    if (isOriginalAspectRatio) {
      const img = e.target;
      setImgHeight(img.naturalHeight);
      setImgWidth(img.naturalWidth);
    }

    setIsImgLoaded(true);
  }

  useEffect(() => {
    if (isVisible) {
      setLazyLoaded(true);
    }
  }, [isVisible]);

  return (
    <AspectRatio
      ref={lazyLoad ? ref : undefined}
      aspectRatio={
        isOriginalAspectRatio
          ? imgWidth && imgHeight
            ? getAspectRatioString(imgWidth, imgHeight)
            : DEFAULT_ASPECT_RATIO
          : aspectRatio
      }
    >
      {lazyLoad && !lazyLoaded ? null : (
        <>
          <StyledBox
            // className={classes.imgWrapper}
          >
            <img
              // className={classes.img}
              src={src || placeholderPng}
              alt={alt}
              onLoad={handleLoad}
            />
          </StyledBox>
          {!isImgLoaded && showFallbackWhileLoading && (
            <StyledBox
              display="flex"
              alignItems="center"
              bgcolor={theme.palette.grey[900]}
            >
              <LoadingIndicator loading />
            </StyledBox>
          )}
        </>
      )}
    </AspectRatio>
  );
}

export default BaseImage;
