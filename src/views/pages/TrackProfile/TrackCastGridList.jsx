import React, { useEffect } from "react";
import { fetchTrackCredits } from "core/actions";
import { useDispatch, useSelector } from "react-redux";
import { selectors } from "core/reducers/index";
import BaseGridList from "views/components/BaseGridList";
import TrackCastGridListItem from "./TrackCastGridListItem";

function renderItem(castCreditId) {
  return <TrackCastGridListItem castCreditId={castCreditId} button />;
}

// function TrackCastGridList({ trackId }) {
//   const dispatch = useDispatch();
//   const trackCredits = useSelector(state =>
//     selectors.selectTrackCredits(state, trackId)
//   );
//   const castCreditIds = trackCredits?.cast || [];
//   const isFetchingCredits = useSelector(state =>
//     selectors.selectIsFetchingTrackCredits(state, trackId)
//   );
//
//   useEffect(() => {
//     dispatch(fetchTrackCredits(trackId));
//   }, [trackId, dispatch]);
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
// export default TrackCastGridList;
