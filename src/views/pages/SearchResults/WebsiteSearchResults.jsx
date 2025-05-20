import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWebsiteSearch } from "core/actions";
import { selectors } from "core/reducers/index";
import InfiniteGridList from "views/components/InfiniteGridList";
import InfiniteList from "views/components/InfiniteList";
import WebsiteCard from "views/components/WebsiteCard/WebsiteCard";
import WebsiteCardBing from "views/components/WebsiteCard/WebsiteCardBing";

function renderItem(websiteId) {
  return (
    <li>
      <WebsiteCard websiteId={websiteId} />
      {/*<WebsiteCardBing websiteId={websiteId} />*/}
    </li>
  );
}

function WebsiteSearchResults({ query }) {
  const dispatch = useDispatch();
  const websiteIds = useSelector(state =>
    selectors.selectWebsiteSearchResultIds(state, query)
  );
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingWebsiteSearchResults(state)
  );
  const nextPage = useSelector(state =>
    selectors.selectWebsiteSearchResultsNextPage(state, query)
  );

  function handleLoadMore() {
    dispatch(fetchWebsiteSearch(query, nextPage));

  }

  return (
    // <InfiniteGridList
    //   items={movieIds}
    //   loading={isFetching}
    //   hasNextPage={!!nextPage}
    //   onLoadMore={handleLoadMore}
    //   renderItem={renderItem}
    // />

    <InfiniteList
    // <InfiniteGridList
      items={websiteIds}
      loading={isFetching}
      hasNextPage={!!nextPage}
      onLoadMore={handleLoadMore}
      renderItem={renderItem}
    />
  );
}

export default WebsiteSearchResults;
