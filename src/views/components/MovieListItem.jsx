import React from "react";
import { useSelector } from "react-redux";
import { selectors } from "core/reducers/index";
import ListItemWithAvatar from "views/components/ListItemWithAvatar";
import { getMovieReleaseYear } from "core/utils";

function MovieListItem({ movieId }) {
  const movie = useSelector(state => selectors.selectMovie(state, movieId));

  const releaseYear = getMovieReleaseYear(movie);

  return (
    <ListItemWithAvatar
      avatarUrl={movie.poster_path}
      primaryText={movie.title}
      secondaryText={releaseYear}
    />
  );
}

export default MovieListItem;
