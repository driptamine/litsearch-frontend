import React from "react";
import { useSelector } from "react-redux";

// MATERIAL DONE
// import { Chip } from "@mui/material";
import { StyledChip } from 'views/styledComponents';

// CORE
import { selectors } from "core/reducers/index";

function AlbumGenreChip({ className, genreId }) {
  const genre = useSelector(state => selectors.selectGenre(state, genreId));

  return <StyledChip className={className} label={genre.name} />;
}

export default AlbumGenreChip;
