import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';

import { fetchPopularMovies } from "core/actions";
import { selectors } from "core/reducers/index";
import MovieFeedCard from "views/components/MovieFeedCard";
import MovieCard from "views/components/MovieCard";
import InfiniteGridList from "views/components/InfiniteGridList";
import InfiniteList from "views/components/InfiniteList";

import Skeleton from "views/skeletons/HomeSkeleton";


// function renderItem(movieId) {
//   // https://chayanit-chaisri.medium.com/react-create-a-show-more-less-button-aa0e9cd0f927
//   return (
//     <StyledLi>
//
//       <MovieFeedCard movieId={movieId} />
//
//     </StyledLi>
//   );
// }

function renderGridItem(movieId) {
  return (
    <li>
      <MovieCard movieId={movieId} />

    </li>
  );
}
const cache = {};

const fetchData = async (id) => {
  if (cache[id]) {
    return cache[id];
  }

  try {
    const response = await axios.get(`${id}`);
    cache[id] = response.data;
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

function PopularMovies() {
  const [tracks, setTracks] = useState(null);
  const paragraphObserver = React.useRef(null);

  const dispatch = useDispatch();
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingPopularMovies(state)
  );
  const nextPage = useSelector(state =>
    selectors.selectPopularMoviesNextPage(state)
  );
  const movieIds = useSelector(state => selectors.selectPopularMovieIds(state));

  function handleLoadMore() {
    dispatch(fetchPopularMovies(nextPage));
  }


  

  useEffect(() => {

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {

          if (entry.intersectionRatio) {
            // callback('WOW-------------------' + entry.target);
            console.log('WOW---Skeleton' );
            const url = 'http://localhost:8000/';
            fetch(url)
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 1.00 }
    );
    paragraphObserver.current = observer;
  }, []);

  // if (isFetching) {
  //   return <Skeleton title={true} />;
  // }

  function renderItem(movieId) {

    // https://chayanit-chaisri.medium.com/react-create-a-show-more-less-button-aa0e9cd0f927


    return (
      // <StyledLi>
      <div>
        {/*{!isFetching &&*/}
          <MovieFeedCard
          // <MovieCard
            movieId={movieId}
            tracks={tracks}
            observer={paragraphObserver.current}
          />
        {/*}*/}

      </div>

      // </StyledLi>
    );
  }

  return (
    <InfiniteList
    // <InfiniteGridList
      items={movieIds}
      loading={isFetching}
      hasNextPage={!!nextPage}
      onLoadMore={handleLoadMore}
      renderItem={renderItem}
    />
  );
}


const StyledLi = styled.li`
  width: 550px;
  margin-left: 18%;
  border: 1.6px solid #383838;
  /* background: #1b1e22; */
  background: #222222;
  /* padding-top: 5em;
  padding-right: 1em;
  padding-bottom: 4em;
  padding-left: 1em;
  margin-top: 1em; */
  border-radius: 10px;
`;
const HeaderText = styled.div`
  color: white;
  cursor: pointer;
  font-family: Helvetica Neue;
  font-weight: 400;
`;
const ShowMore = styled.div`
  cursor: pointer;
  color: #347c8a;


  &:hover{
    text-decoration: underline;
  }
`;

const Stats = styled.div`
  display: flex;
  margin-top: 10px;
  color: white;
  column-gap: 8px;
  justify-content: space-between;
`;
const Likes = styled.div`

`;
const Comments = styled.div`

`;
const Impressions = styled.div`

`;

export default PopularMovies;
