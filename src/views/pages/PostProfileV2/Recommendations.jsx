import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// MATERIAL DONE
// import { useTheme } from "@mui/material/styles";


import MovieCard from "views/components/MovieCard";
import BaseGridList from "views/components/BaseGridList";

import { fetchRecommendations } from "core/actions";
import { selectors } from "core/reducers/index";


function renderItem(recommendationId) {
  return (
    <li>
      <MovieCard movieId={recommendationId} />
    </li>
  );
}

function Recommendations({ movieId }) {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const recommendationIds = useSelector(
    state => selectors.selectMovieRecommendations(state, movieId) || []
  );
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingMovieRecommendations(state, movieId)
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
    dispatch(fetchRecommendations(movieId));
  }, [movieId, dispatch]);

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
