import React, { useEffect } from "react";
// import { fetchAlbumCredits } from "core/actions";
import { useDispatch, useSelector } from "react-redux";
import { selectors } from "core/reducers/index";
import BaseGridList from "views/components/BaseGridList";
// import AlbumCastGridListItem from "./AlbumCastGridListItem";

// function renderItem(castCreditId) {
//   return <AlbumCastGridListItem castCreditId={castCreditId} button />;
// }

// function AlbumCastGridList({ albumId }) {
//   const dispatch = useDispatch();
//   const albumCredits = useSelector(state =>
//     selectors.selectAlbumCredits(state, albumId)
//   );
//   const castCreditIds = albumCredits?.cast || [];
//   const isFetchingCredits = useSelector(state =>
//     selectors.selectIsFetchingAlbumCredits(state, albumId)
//   );
//
//   useEffect(() => {
//     dispatch(fetchAlbumCredits(albumId));
//   }, [albumId, dispatch]);
//
//   return (
//     <BaseGridList
//       items={castCreditIds}
//       loading={isFetchingCredits}
//       minItemWidth={230}
//       renderItem={renderItem}
//       listEmptyMessage="No cast has been found"
//     />
//   );
// }
//
// export default AlbumCastGridList;
