import React from "react";
import { useSelector } from "react-redux";


// MATERIAL DONE
// import { Typography, Box, Grid, Link, makeStyles } from "@mui/material";
import { StyledTypography, StyledBox, StyledGrid, StyledLink } from 'views/styledComponents';


import Rating from "./Rating";
import Introduction from "views/components/Introduction";
import ImdbLogo from "views/components/ImdbLogo";
import MovieGenreChip from "./MovieGenreChip";

import { selectors } from "core/reducers/index";
import { getMovieReleaseYear, getImdbProfileUrl } from "core/utils";

// const useStyles = makeStyles(theme => ({
//   year: {
//     color: theme.palette.text.secondary
//   },
//   tagline: {
//     fontStyle: "italic"
//   },
//   genreChip: {
//     margin: theme.spacing(0.5)
//   },
//   overview: {
//     whiteSpace: "pre-wrap"
//   }
// }));

function MovieIntroduction({ movieId }) {
  const movie = useSelector(state => selectors.selectMovie(state, movieId));
  // const classes = useStyles();

  const releaseYear = getMovieReleaseYear(movie);

  if (!movie) {
    return null;
  }

  // const linkList = album.artists.map((artist) => {
  //   return (
  //     // <li key={artist.id}>
  //       <Link
  //         // key={.id}
  //         to={`/person/${artist.artist_uri}/`}
  //         style={{
  //           fontWeight: "bold",
  //           color: '#FFF',
  //           textDecoration: 'none',
  //           "&:hover": {
  //             textDecoration: "underline"
  //           }
  //         }}
  //         >
  //         {artist.name}, {'       '}
  //       </Link>
  //     // </li>
  //   );
  // });

  return (
    <Introduction
      obj={movie}
      backgroundImageSrc={movie.backdrop_path}
      imageSrc={movie.poster_path}
      title={
        <>
          <StyledTypography variant="h5" gutterBottom={!movie.tagline}>
            {movie.title}
            {releaseYear && (
              <>
                {" "}
                <span
                  // className={classes.year}
                >
                  {`(${getMovieReleaseYear(movie)})`}
                </span>
              </>
            )}
          </StyledTypography>
          {movie.tagline && (
            <StyledTypography
              // className={classes.tagline}
              color="textSecondary"
              gutterBottom
            >
              {`"${movie.tagline}"`}
            </StyledTypography>
          )}
        </>
      }
      content={
        <>
          <StyledGrid container spacing={2}>
            <StyledGrid item xs={12}>
              <StyledBox display="flex" alignItems="center">
                {/*<Rating value={movie.vote_average * 10} />*/}
                {/*<Rating value={movie.vote_average} />*/}
                <StyledBox marginLeft={2}>
                  <StyledLink
                    href={getImdbProfileUrl(movie.imdb_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/*<ImdbLogo />*/}
                  </StyledLink>
                </StyledBox>
              </StyledBox>
            </StyledGrid>


          </StyledGrid>
        </>
      }
    />
  );
}

export default MovieIntroduction;
