import React from "react";
import { useSelector } from "react-redux";

// MATERIAL DONE
// import { Typography, Box, useTheme } from "@mui/material";
import { StyledTypography, StyledBox } from 'views/styledComponents';

// CORE
import { selectors } from "core/reducers/index";

function MovieRatingTag({ movieId }) {
  const movie = useSelector(state => selectors.selectMovie(state, movieId));
  // const theme = useTheme();

  return (
    <StyledBox
      // bgcolor={theme.palette.secondary.main} 
      paddingY={0.25}
      paddingX={0.5}
    >
      <StyledTypography variant="caption">{movie.vote_average} / 10</StyledTypography>
    </StyledBox>
  );
}

export default MovieRatingTag;
