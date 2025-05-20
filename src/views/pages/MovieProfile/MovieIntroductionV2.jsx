import React, {useEffect} from "react";
import { useSelector } from "react-redux";


// MATERIAL DONE
// import { Typography, Box, Grid, Link, makeStyles } from "@mui/material";
import { StyledTypography, StyledBox, StyledGrid, StyledLink } from 'views/styledComponents';

import BaseImageV2 from "views/components/BaseImageV2";
import BaseCard from "views/components/BaseCard";

import Rating from "./Rating";
import Introduction from "views/components/Introduction";
import ImdbLogo from "views/components/ImdbLogo";
import MovieGenreChip from "./MovieGenreChip";

import { selectors } from "core/reducers/index";
import { getMovieReleaseYear, getImdbProfileUrl } from "core/utils";
import { getAspectRatioString } from "views/components/AspectRatio";
import { useConfiguration } from "views/components/ConfigurationProvider";


function MovieIntroductionV2({ movieId, obj }) {
// function MovieIntroductionV2({ movieId }) {
  const movie = useSelector(state => selectors.selectMovie(state, movieId));
  // const classes = useStyles();
  const { getImageUrl } = useConfiguration();
  const releaseYear = getMovieReleaseYear(movie);

  if (!movie) {
    return null;
  }


  // useEffect(() => {
  //   // obj && document.title = obj.title;
  //   document.title = obj.title;
  // }, [])

  return (
    <div>
      <StyledTypography color="#00a0b0">{movie.title}</StyledTypography>
      {/*<img src={movie.poster_path} />*/}
      {/*<StyledBox display="flex">*/}
        <BaseImageV2
          src={getImageUrl(movie.poster_path)}
          aspectRatio={getAspectRatioString(2, 3)}
          width={20}
        />
        {/*<a target="_blank" href={`https://rezka.ag/search/?q=${movie.title}&do=search&subaction=search`}>rezka</a>*/}
      {/*</StyledBox>*/}
      <StyledBox display="flex" alignItems="center">

        <StyledBox marginLeft={2} display="flex">
          <StyledLink
            href={getImdbProfileUrl(movie.imdb_id)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ImdbLogo />
          </StyledLink>
          {/*<Rating value={movie.vote_average * 10} />*/}
          <Rating value={movie.vote_average} />
          <a target="_blank" href={`https://rezka.ag/search/?q=${movie.title}&do=search&subaction=search`}>rezka</a>
        </StyledBox>
      </StyledBox>
    </div>

  );
}

export default MovieIntroductionV2;
