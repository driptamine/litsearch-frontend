import React from "react";
import { useSelector } from "react-redux";
import { selectors } from "core/reducers/index";
import RouterLink from "views/components/RouterLink";
import AlbumListItem from "views/components/AlbumListItem";

function AlbumCastGridListItem({ castCreditId }) {
  const cast = useSelector(state =>
    selectors.selectCastCredits(state, castCreditId)
  );

  const albumId = cast.album;

  return (
    <AlbumListItem
      albumId={albumId}
      secondaryText={cast.character}
      button
      to={`/album/${albumId}`}
      component={RouterLink}
    />
  );
}

export default AlbumCastGridListItem;
