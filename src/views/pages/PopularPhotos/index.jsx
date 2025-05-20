import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularPhotos } from "core/actions";
import { selectors } from "core/reducers/index";
import PhotoCard from "views/components/PhotoCard";
import InfiniteGridList from "views/components/InfiniteGridList";

function renderItem(photoId) {
  return (
    <li>
      <PhotoCard photoId={photoId} />
    </li>
  );
}

function PopularPhotos() {
  const dispatch = useDispatch();
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingPopularPhotos(state)
  );
  const nextPage = useSelector(state =>
    selectors.selectPopularPhotosNextPage(state)
  );
  const photoIds = useSelector(state => selectors.selectPopularPhotoIds(state));

  function handleLoadMore() {
    dispatch(fetchPopularPhotos(nextPage));
  }

  return (
    <InfiniteGridList
      items={photoIds}
      loading={isFetching}
      hasNextPage={!!nextPage}
      onLoadMore={handleLoadMore}
      renderItem={renderItem}
    />
  );
}

export default PopularPhotos;
