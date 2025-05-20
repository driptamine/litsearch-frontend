import React from 'react';
import ModalLink  from './ModalLink';
import PropTypes from 'prop-types';
// import { getAllMovies } from '../data';

const ModalMovieList = ({ movies }) => {
  // const movies = getAllMovies();

  return (
    <ul>
      {movies.map(movie => (
        <li key={movie.id}>
          <ModalLink to={`/movies/${movie.id}`}>
            {movie.title}
          </ModalLink>
        </li>
      ))}
    </ul>
  );
};

// MovieList.propTypes = {
//   movies: PropTypes.arrayOf(PropTypes.object)
// };

export default ModalMovieList;
