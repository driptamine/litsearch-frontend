import React from 'react';
// import ModalMovieList from "views/components/ModalMovieList";
import PopularMagazines from "views/pages/PopularMagazines";

// import { getAllMagazines } from 'core/data';

const ModalMagazines = () => {
  // const magazines = getAllMagazines();

  return (
    <React.Fragment>

      {/*<ModalMovieList movies={movies} />*/}
      {/*<ModalPopularMovies movies={movies} />*/}
      <PopularMagazines />
    </React.Fragment>
  );
};

export default ModalMagazines;
