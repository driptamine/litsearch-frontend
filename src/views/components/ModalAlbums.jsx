import React from 'react';
import ModalMovieList from 'views/components/ModalMovieList';
import PopularAlbums from "views/pages/PopularAlbums";
import { getAllMovies } from 'core/data';

const ModalAlbums = () => {
  const albums = getAllMovies();

  return (
    <React.Fragment>

      {/*<ModalMovieList movies={movies} />*/}
      {/*<ModalPopularMovies movies={movies} />*/}
      <PopularAlbums />
    </React.Fragment>
  );
};

export default ModalAlbums;
