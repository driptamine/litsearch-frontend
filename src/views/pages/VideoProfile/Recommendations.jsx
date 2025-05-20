import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// MATERIAL DONE
// import { useTheme } from "@mui/material/styles";
import MovieCard from "views/components/MovieCard";
import BaseGridList from "views/components/BaseGridList";

// CORE
import { fetchRecommendations } from "core/actions";
import { selectors } from "core/reducers/index";

function renderItem(recommendationId) {
  return (
    <li>
      <VideoCard videoId={recommendationId} />
    </li>
  );
}

function Recommendations({ videoId }) {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const recommendationIds = useSelector(
    state => selectors.selectVideoRecommendations(state, videoId) || []
  );
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingVideoRecommendations(state, videoId)
  );

  // const nextPage = useSelector(state =>
  //   selectors.selectAlbumSearchResultsNextPage(state, movieId)
  // );
  // const nextOffset = useSelector(state =>
  //   selectors.selectAlbumSearchResultsNextPage(state, movieId)
  // );
  //
  // function handleLoadMore() {
  //   dispatch(fetchRecommendations(movieId, nextPage, nextOffset));
  // }
  //
  // return (
  //   <InfiniteGridList
  //     items={recommendationIds}
  //     loading={isFetching}
  //     hasNextPage={!!nextPage}
  //     onLoadMore={handleLoadMore}
  //     renderItem={renderItem}
  //   />
  // );

  useEffect(() => {
    dispatch(fetchRecommendations(videoId));
  }, [videoId, dispatch]);

  return (
    <BaseGridList
      items={recommendationIds}
      loading={isFetching}
      renderItem={renderItem}
      // minItemWidth={260 / 2 - theme.spacing(2)}
      listEmptyMessage="No recommendation has been found"
    />
  );
}

export default Recommendations;
