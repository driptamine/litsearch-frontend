import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchImageSearch, fetchBraveImageSearch } from 'core/actions';
import { selectors } from 'core/reducers/index';
import InfiniteGridList from 'views/components/InfiniteGridList';
import InfiniteList from 'views/components/InfiniteList';
import InfiniteListFlex from 'views/components/InfiniteListFlex';
import ImageCard from 'views/components/ImageCard';
import ImageCardBrave from 'views/components/ImageCardBrave';
import ImageCardBing from 'views/components/ImageCardBing';

function renderItem(imageId) {
  return (

      <ImageCardBrave imageId={imageId} />

  );
}

function ImageSearchResultsBrave({ query }) {
  const dispatch = useDispatch();
  const imageIds = useSelector(state =>
    selectors.selectImageSearchResultIds(state, query)
  );
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingImageSearchResults(state)
  );
  const nextPage = useSelector(state =>
    selectors.selectImageSearchResultsNextPage(state, query)
  );

  function handleLoadMore() {
    dispatch(fetchBraveImageSearch(query, nextPage));

  }

  return (
    // <InfiniteGridList
    //   items={movieIds}
    //   loading={isFetching}
    //   hasNextPage={!!nextPage}
    //   onLoadMore={handleLoadMore}
    //   renderItem={renderItem}
    // />

    // <InfiniteList
    <InfiniteListFlex
      items={imageIds}
      loading={isFetching}
      hasNextPage={!!nextPage}
      onLoadMore={handleLoadMore}
      renderItem={renderItem}
    />
  );
}

export default ImageSearchResultsBrave;
