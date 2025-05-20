import React from "react";
import { useSelector } from "react-redux";
import { selectors } from "core/reducers/index";
import MovieCard from "views/components/MovieCard";

function ArtistCastingGridListItem({ castCreditId }) {
  const cast = useSelector(state =>
    selectors.selectCastCredits(state, castCreditId)
  );

  return (
    <li>
      <MovieCard movieId={cast.movie} subheader={cast.character} />
    </li>
  );
}

export default ArtistCastingGridListItem;
