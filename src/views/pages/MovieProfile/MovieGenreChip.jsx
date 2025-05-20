import React from "react";
import { useSelector } from "react-redux";

// MATERIAL DONE
// import { Chip } from "@mui/material";
import { StyledChip } from 'views/styledComponents';

import { selectors } from "core/reducers/index";

function MovieGenreChip({ className, genreId }) {
  const genre = useSelector(state => selectors.selectGenre(state, genreId));

  return <StyledChip className={className} label={genre.name} />;
}

export default MovieGenreChip;
