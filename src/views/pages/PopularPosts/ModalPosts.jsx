import React from 'react';
import ModalMovieList from "views/components/ModalMovieList";
import PopularPosts from "views/pages/PopularPosts";
import PopularMoviesWithPagination from "views/pages/PopularPosts/indexV2";
import { getAllMovies } from 'core/data';

const ModalPosts = () => {
  const movies = getAllMovies();

  return (
    <React.Fragment>

      {/*<ModalMovieList movies={movies} />*/}
      {/*<ModalPopularMovies movies={movies} />*/}
      {/*<PopularPosts />*/}
      <PopularMoviesWithPagination />
    </React.Fragment>
  );
};

export default ModalPosts;
