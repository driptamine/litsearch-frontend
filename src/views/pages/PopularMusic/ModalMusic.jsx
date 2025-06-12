import React from 'react';
import ModalMovieList from 'views/components/ModalMovieList';
import PopularMusic from 'views/pages/PopularMusic';
 
const ModalMusic = () => {
  const movies = getAllMovies();

  return (
    <React.Fragment>

      <PopularMusic />

    </React.Fragment>
  );
};

export default ModalMusic;
