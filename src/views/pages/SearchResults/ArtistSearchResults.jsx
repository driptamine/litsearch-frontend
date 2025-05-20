import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtistSearch } from "core/actions";
import { selectors } from "core/reducers/index";
import InfiniteGridList from "views/components/InfiniteGridList";
import ArtistCard from "views/components/ArtistCard";

function renderItem(artistId) {
  return (
    <li>
      <ArtistCard artistId={artistId} />
    </li>
  );
}

function ArtistSearchResults({ query }) {
  const dispatch = useDispatch();
  const artistIds = useSelector(state =>
    selectors.selectArtistSearchResultIds(state, query)
  );
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingArtistSearchResults(state, query)
  );
  const nextPage = useSelector(state =>
    selectors.selectArtistSearchResultsNextPage(state, query)
  );

  const nextOffset = useSelector(state =>
    selectors.selectArtistSearchResultsNextPage(state, query)
  );

  function handleLoadMore() {
    dispatch(fetchArtistSearch(query, nextPage, nextOffset));
  }

  return (
    <InfiniteGridList
      items={artistIds}
      loading={isFetching}
      hasNextPage={!!nextPage}
      onLoadMore={handleLoadMore}
      renderItem={renderItem}
    />
  );
}

export default ArtistSearchResults;
