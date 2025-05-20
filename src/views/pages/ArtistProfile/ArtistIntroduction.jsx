import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

// MATERIAL DONE
// import { Typography, Box, Grid, Link, makeStyles } from "@mui/material";
import { StyledTypography, StyledBox, StyledGrid, StyledLink } from 'views/styledComponents';

import BaseImage from "views/components/BaseImage";
import Introduktion from "views/components/Introduktion";
import ImdbLogo from "views/components/ImdbLogo";

import { getAspectRatioString } from "views/components/AspectRatio";
import { useConfiguration } from "views/components/ConfigurationProvider";

import { selectors } from "core/reducers/index";
import { getImdbProfileUrl } from "core/utils";


// const useStyles = makeStyles(theme => ({
//   biography: {
//     whiteSpace: "pre-wrap"
//   }
// }));

const ReStyledTypography = styled.p`
   white-space: pre-wrap;
`;
const ReBaseImage = styled.img`
  width: 10%;
`;
function ArtistIntroduction({ artistId }) {
  const artist = useSelector(state => selectors.selectArtist(state, artistId));
  // const classes = useStyles();

  if (!artist) {
    return null;
  }

  return (
    <Introduktion
      obj={artist}
      imageSrc={
        <>
          <StyledBox flexBasis={100}>
            <ReBaseImage
              src={artist.images[0] ? artist.images[0].url : ""}
              aspectRatio={getAspectRatioString(1, 1)}
            />
          </StyledBox>
        </>
      }
      backgroundImageSrc={artist.images[0] ? artist.images[0].url : ""}
      title={artist.name}
      content={
        <>
          <StyledGrid container spacing={2}>
            <StyledGrid item xs={12}>
              <StyledBox display="flex" alignItems="center">
                {/*<Link
                  href={getImdbProfileUrl(artist.imdb_id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ImdbLogo />
                </Link>*/}
              </StyledBox>
            </StyledGrid>
            <StyledGrid item xs={12}>
              <StyledTypography variant="h6" gutterBottom>
                Biography
              </StyledTypography>
              <ReStyledTypography biography variant="body2">
                {artist.biography}
              </ReStyledTypography>
            </StyledGrid>
          </StyledGrid>
        </>
      }
    />
  );
}

export default ArtistIntroduction;
