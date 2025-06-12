import React, { useEffect } from 'react';
import styled from 'styled-components';
// MATERIAL DONE
// import { Box, Typography, makeStyles } from '@mui/material';
import { StyledBox, StyledTypography } from 'views/styledComponents';


import BaseImage from 'views/components/BaseImage';
import AudioPlayer from 'views/components/video-player/web/AudioPlayer';
import { getAspectRatioString } from './AspectRatio';
import { useConfiguration } from './ConfigurationProvider';

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
//     // backgroundImage: "radial-gradient(circle at 20% 50%, rgba(12.55%, 24.71%, 34.51%, 0.98) 0%, rgba(12.55%, 24.71%, 34.51%, 0.88) 100%)"
//   }
// }));

const StyledDiv = styled.div`
  /* width: 10%; */
`;

const ReStyledTypography = styled(StyledTypography)`
  color: white;
`;

function Introduktion({ backgroundImageSrc, imageSrc, obj, title, content, likeButton, uploadButton, commentSection }) {
  const { getImageUrl } = useConfiguration();
  // const classes = useStyles({
  //   backgroundImageSrc: getImageUrl(backgroundImageSrc)
  // });

  useEffect(() => {
    document.title = obj.name;
  }, [])

  return (
    <StyledDiv className="position" position="relative">
      {/*<div className={classes.backdrop} />*/}
      <div
        className="DAMN"
        display="flex"
        // flexWrap="wrap"
        justifyContent="center"
        position="relative"
        zIndex={1}
      >
        {/*<Box flexBasis={300}>
          <BaseImage
            src={imageSrc}
            aspectRatio={getAspectRatioString(2, 3)}
          />
        </Box>*/}
        {imageSrc}

        <StyledBox padding={2} flex={1} flexBasis={300}>
          {typeof title === "string" ? (
            <ReStyledTypography variant="h5" gutterBottom>
              {title}
            </ReStyledTypography>
          ) : (
            title
          )}
          {content}

        </StyledBox>
        {obj.preview_url &&
          <AudioPlayer
            url={obj.preview_url}

          />
        }

      </div>
      {likeButton}
      {uploadButton}
      {commentSection}
    </StyledDiv>
  );
}

export default Introduktion;
