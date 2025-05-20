import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlbumSearch } from "core/actions";
import { selectors } from "core/reducers/index";
import InfiniteGridList from "views/components/InfiniteGridList";
import AlbumCard from "views/components/AlbumCard";
import AlbumItem from "views/components/AlbumItem";

function renderItem(albumId) {
  return (
    <li>
      <AlbumItem albumId={albumId} />
    </li>
  );
}

function AlbumSearchResults({ query }) {
  const dispatch = useDispatch();
  const albumIds = useSelector(state =>
    selectors.selectAlbumSearchResultIds(state, query)
  );
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingAlbumSearchResults(state)
  );
  const nextPage = useSelector(state =>
    selectors.selectAlbumSearchResultsNextPage(state, query)
  );
  const nextOffset = useSelector(state =>
    selectors.selectAlbumSearchResultsNextPage(state, query)
  );

  function handleLoadMore() {
    dispatch(fetchAlbumSearch(query, nextPage, nextOffset));
  }

  return (
    <InfiniteGridList
      items={albumIds}
      loading={isFetching}
      hasNextPage={!!nextPage}
      onLoadMore={handleLoadMore}
      renderItem={renderItem}
    />
  );
}

export default AlbumSearchResults;
