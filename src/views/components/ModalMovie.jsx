import React from 'react';
import styled from 'styled-components';

import BaseImage from "views/components/BaseImage";
import ModalMovieList from 'views/components/ModalMovieList';

import { getDirectorByMovieId, getMovieById } from 'core/data';
// import { ModalLink } from '../../../src';
// import  ModalLink  from 'views/components/ModalLink';
import  ModalLink  from './ModalLink';

// MODAL DONE
// import { Typography } from '@mui/material';
import { StyledTypography } from 'views/styledComponents';

const Root = styled.div`
  padding: 12px;
`;

// const StyledTypography = styled.p`
//
// `;

const ModalMovie = ({
  match: {
    params: { id }
  }
}) => {
  const movie = getMovieById(id);

  const director = getDirectorByMovieId(id);

  const otherMovies = director.movies.filter(movie => movie.id !== id);

  return (
    <Root>
      <StyledTypography variant="h6">{movie.title}</StyledTypography>
      {/*<BaseImage
        src={getImageUrl(movie.poster_path)}
        alt={movie.title}
        aspectRatio={getAspectRatioString(2, 3)}
      />*/}
      <ModalLink to={`/directors/${director.id}`} style={{ fontSize: 14 }}>
        {director.name}
      </ModalLink>
      <hr />
      <p>Other movies by {director.name}:</p>
      <ModalMovieList movies={otherMovies} />
    </Root>
  );
};

// Movie.propTypes = {
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       id: PropTypes.string
//     })
//   }).isRequired
// };

export default ModalMovie;
