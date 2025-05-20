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

function ArtistIntroductionV2({ artistId }) {
  const artist = useSelector(state => selectors.selectArtist(state, artistId));
  // const classes = useStyles();

  if (!artist) {
    return null;
  }

  return (
    <div>{artist.name}</div>
  );
}

export default ArtistIntroductionV2;
