import React from "react";
import { useSelector } from "react-redux";
import { selectors } from "core/reducers/index";
import RouterLink from "views/components/RouterLink";
import PersonListItem from "views/components/PersonListItem";

function MovieCastGridListItem({ castCreditId }) {
  const cast = useSelector(state =>
    selectors.selectCastCredits(state, castCreditId)
  );

  const personId = cast.person;

  return (
    <PersonListItem
      personId={personId}
      secondaryText={cast.character}
      button
      to={`/person/${personId}`}
      component={RouterLink}
    />
  );
}

export default MovieCastGridListItem;
