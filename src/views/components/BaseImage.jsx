import React, { useState, useEffect } from "react";
import { useTrackVisibility } from "react-intersection-observer-hook";
import styled from "styled-components";


// MATERIAL DONE
// import { makeStyles } from "@mui/material/styles";
// import { Box, useTheme } from "@mui/material";
import { StyledBox } from 'views/styledComponents';

import placeholderPng from "views/assets/placeholder.png";


import LoadingIndicator from "./LoadingIndicator";
import AspectRatio, { getAspectRatioString } from "./AspectRatio";

const ORIGINAL = "original";
const DEFAULT_ALT = "Not Loaded";
const DEFAULT_ASPECT_RATIO = getAspectRatioString(1, 1);





function BaseImage({
  src,
  alt = DEFAULT_ALT,
  aspectRatio = ORIGINAL,
  lazyLoad = true,
  objectFit = "contain",
  showFallbackWhileLoading,
  width, border
}) {
  // const classes = useStyles({ objectFit });
  // const theme = useTheme();
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
          <StyledBox >
            {/*<img src={URL.createObjectURL(src)} />*/}
            <StyledImg
              // className={classes.img}
              border={border}
              src={src || placeholderPng}
              // width={width}
              alt={alt}
              onLoad={handleLoad}
              // objectFit={objectFit}
            />
          </StyledBox>
          {!isImgLoaded && showFallbackWhileLoading && (
            <StyledBox
              display="flex"
              alignItems="center"
              // bgcolor={theme.palette.grey[900]}
            >
              <LoadingIndicator loading />
            </StyledBox>
          )}
        </>
      )}
    </AspectRatio>
  );
}

const StyledImg = styled.img`
  /* width: ${(props) => props.width}; */

  /* width: ${(props) => (props.width ? `${props.width} px` : `100%`)}; */
  border-radius: ${(props) => (props.border)}px;
  border-radius: ${(props) => (props.border ? `${props.border} px` : `0px`)};

  width: 100%;
  height: 100%;


  /* width: 20%;
  height: 100% */

  object-fit: ${(props) => props.objectFit}
`;

export default BaseImage;
