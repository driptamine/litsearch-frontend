import React from 'react';
import ModalMovieList from "views/components/ModalMovieList";
import PopularPeople from "views/pages/PopularPeople";
import { getAllMovies } from 'core/data';

const ModalPeople = () => {
  const movies = getAllMovies();

  return (
    <React.Fragment>

      {/*<ModalMovieList movies={movies} />*/}
      {/*<ModalPopularMovies movies={movies} />*/}
      <PopularPeople />
    </React.Fragment>
  );
};

export default ModalPeople;
