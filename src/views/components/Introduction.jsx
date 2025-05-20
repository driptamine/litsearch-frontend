import React from "react";
import styled, { css } from "styled-components";


import BaseImage from "views/components/BaseImage";
import BaseImageV2 from "views/components/BaseImageV2";

import { StyledBox, StyledTypography } from 'views/styledComponents';
// import { makeStyles, Box, Typography } from "@mui/material";
import { getAspectRatioString } from "./AspectRatio";
import { useConfiguration } from "./ConfigurationProvider";

// const useStyles = makeStyles(theme => ({
//   backdrop: {
//     backgroundImage: ({ backgroundImageSrc }) => `url(${backgroundImageSrc})`,
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     backgroundSize: "cover",
//     filter: "opacity(100) grayscale(100%) contrast(130%)",
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%"
//   },
//   container: {
//
//   }
// }));

const BaseImageV3 = styled(BaseImageV2)`
  width: 50%;
`;
const BackdropDiv = styled.div`
  background-image: ${(props) => `url(${props.backgroundImageSrc})`},


  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: opacity(100) grayscale(100%) contrast(130%);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

// const StyledBox = styled.div`
//   background-image: radial-gradient(circle at 20% 50%, rgba(12.55%, 24.71%, 34.51%, 0.98) 0%, rgba(12.55%, 24.71%, 34.51%, 0.88) 100%);
//
//
// `;
const Styled = styled.div`
  background-image: radial-gradient(circle at 20% 50%, rgba(12.55%, 24.71%, 34.51%, 0.98) 0%, rgba(12.55%, 24.71%, 34.51%, 0.88) 100%);

  ${(props) =>
    props.display &&
    css`
      display: ${(props) => props.display};
      flex-wrap: ${(props) => props.flexWrap};
      justify-content: ${(props) => props.flexWrap};
      position: ${(props) => props.position};
      z-index: ${(props) => props.zIndex}
    `}

  ${(props) =>
    props.flexBasis &&
    css`
      display: ${(props) => props.display};
      flex-wrap: ${(props) => props.flexWrap};
      justify-content: ${(props) => props.flexWrap};
      position: ${(props) => props.position};
      z-index: ${(props) => props.zIndex}
    `
   }
`;


function Introduction({ backgroundImageSrc, obj, imageSrc, title, content }) {
  const { getImageUrl } = useConfiguration();
  // const classes = useStyles({
  //   backgroundImageSrc: getImageUrl(backgroundImageSrc)
  // });

  // useEffect(() => {
  //   document.title = obj.title;
  // })

  return (
    <StyledBox position="relative">
      <BackdropDiv></BackdropDiv>
      <StyledBox
        // className={classes.container}
        display={"flex"}
        // flexWrap="wrap"
        justifyContent="center"
        position="relative"
        zIndex={1}
      >
        <StyledBox flexBasis={300}>
          <BaseImageV3
            src={getImageUrl(imageSrc)}
            aspectRatio={getAspectRatioString(2, 3)}
          />
        </StyledBox>
        <StyledBox padding={2} flex={1} flexBasis={300}>
          {typeof title === "string" ? (
            <StyledTypography variant="h5" gutterBottom>
              {title}
            </StyledTypography>
          ) : (
            title
          )}
          {content}
        </StyledBox>
      </StyledBox>
    </StyledBox>
  );
}

export default Introduction;
