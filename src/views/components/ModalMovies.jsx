import React from 'react';
import ModalMovieList from "views/components/ModalMovieList";
import PopularMovies from "views/pages/PopularMovies";
import { getAllMovies } from 'core/data';

const ModalMovies = () => {
  const movies = getAllMovies();

  return (
    <React.Fragment>

      {/*<ModalMovieList movies={movies} />*/}
      {/*<ModalPopularMovies movies={movies} />*/}
      <PopularMovies />
    </React.Fragment>
  );
};

export default ModalMovies;
