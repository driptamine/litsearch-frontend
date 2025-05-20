import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrackSearch } from "core/actions";
import { selectors } from "core/reducers/index";
import InfiniteGridList from "views/components/InfiniteGridList";
import TrackCard from "views/components/TrackCard";

function renderItem(trackId) {
  return (
    <li>
      <TrackCard trackId={trackId} />
    </li>
  );
}

function TrackSearchResults({ query }) {
  const dispatch = useDispatch();
  const trackIds = useSelector(state =>
    selectors.selectTrackSearchResultIds(state, query)
  );
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingTrackSearchResults(state)
  );
  const nextPage = useSelector(state =>
    selectors.selectTrackSearchResultsNextPage(state, query)
  );
  const nextOffset = useSelector(state =>
    selectors.selectTrackSearchResultsNextPage(state, query)
  );

  function handleLoadMore() {
    dispatch(fetchTrackSearch(query, nextPage, nextOffset));
  }

  return (
    <InfiniteGridList
      items={trackIds}
      loading={isFetching}
      hasNextPage={!!nextPage}
      onLoadMore={handleLoadMore}
      renderItem={renderItem}
    />
  );
}

export default TrackSearchResults;
