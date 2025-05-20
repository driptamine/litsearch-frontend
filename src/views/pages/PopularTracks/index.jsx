import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularTracks } from "core/actions";
import { selectors } from "core/reducers/index";
import TrackCard from "views/components/TrackCard";
import InfiniteGridList from "views/components/InfiniteGridList";

function renderItem(trackId) {
  return (
    <li>
      <TrackCard trackId={trackId} />
    </li>
  );
}

function PopularTracks() {
  const dispatch = useDispatch();
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingPopularTracks(state)
  );
  const nextPage = useSelector(state =>
    selectors.selectPopularTracksNextPage(state)
  );
  const trackIds = useSelector(state =>
    selectors.selectPopularTracksIds(state)
  );

  function handleLoadMore() {
    dispatch(fetchPopularTracks(nextPage));
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

export default PopularTracks;
