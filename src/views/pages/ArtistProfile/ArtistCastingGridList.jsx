import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectors } from "core/reducers/index";
// import { fetchArtistCredits } from "core/actions";
import BaseGridList from "views/components/BaseGridList";
import ArtistCastingGridListItem from "./ArtistCastingGridListItem";

// function renderItem(castingId) {
//   return <ArtistCastingGridListItem castCreditId={castingId} />;
// }
//
// function ArtistCastingGridList({ artistId }) {
//   const dispatch = useDispatch();
//   const artistCredits = useSelector(state =>
//     selectors.selectArtistCredits(state, artistId)
//   );
//   const castingIds = artistCredits?.castings || [];
//   const isFetching = useSelector(state =>
//     selectors.selectIsFetchingArtistCredits(state, artistId)
//   );
//
//   useEffect(() => {
//     dispatch(fetchArtistCredits(artistId));
//   }, [artistId, dispatch]);
//
//   return (
//     <BaseGridList
//       items={castingIds}
//       loading={isFetching}
//       renderItem={renderItem}
//       listEmptyMessage="No casting has been found"
//     />
//   );
// }
//
// export default ArtistCastingGridList;
