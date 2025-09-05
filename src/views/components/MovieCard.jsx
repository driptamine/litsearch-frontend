import React from 'react';
import { useSelector } from 'react-redux';

// MATERIAL DONE
// import { makeStyles } from '@mui/material/styles';


import BaseImage from 'views/components/BaseImage';
import BaseCard from 'views/components/BaseCard';
import RouterLink from 'views/components/RouterLink';
import ModalLink from 'views/components/ModalLink';
import BaseCardHeader from 'views/components/BaseCardHeader';
import MovieRatingTag from './MovieRatingTag';
import { getAspectRatioString } from './AspectRatio';
import { useConfiguration } from './ConfigurationProvider';

import { selectors } from 'core/reducers/index';

// const useStyles = makeStyles(theme => ({
//   link: {
//     textDecoration: "none"
//   }
// }));

function MovieCard({ movieId, subheader }) {
  // const classes = useStyles();
  const movie = useSelector(state => selectors.selectMovie(state, movieId));
  const { getImageUrl } = useConfiguration();

  return (
    <ModalLink to={`/movies/${movieId}`}>

      {/*<RouterLink className={classes.link} to={`/movie/${movieId}`}>*/}

        <BaseCard hasActionArea>
          {/*{movie.title}*/}

          <BaseImage
            src={getImageUrl(movie.poster_path, { size: "w300" })}
            alt={movie.title}
            // aspectRatio={getAspectRatioString(2, 3)}
            // aspectRatio={getAspectRatioString(3, 3)}
            aspectRatio={getAspectRatioString(1, 1)}
          />

          {/*<div style={{ position: "absolute", top: 0, left: 0 }}>
            <MovieRatingTag movieId={movieId} />
          </div>*/}
          {/*<BaseCardHeader title={movie.title} subheader={subheader} />*/}


          <BaseCardHeader  subheader={subheader} />

        </BaseCard>
      {/*</RouterLink>*/}
    </ModalLink>
  );
}

export default MovieCard;
