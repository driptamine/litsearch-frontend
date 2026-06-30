import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import BaseImage from 'views/components/BaseImage';
import BaseCard from 'views/components/BaseCard';
import ModalLink from 'views/components/ModalLink';
import BaseCardHeader from 'views/components/BaseCardHeader';
import { getAspectRatioString } from './AspectRatio';
import { useConfiguration } from './ConfigurationProvider';
import { queueMovieImpression } from './movieImpressionQueue';

import { selectors } from 'core/reducers/index';

function MovieCard({ movieId, subheader }) {
  const movie = useSelector(state => selectors.selectMovie(state, movieId));
  const { getImageUrl } = useConfiguration();
  const cardRef = useRef(null);
  const impressionQueuedRef = useRef(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const dbId = movie?.db_id;
    if (!dbId) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting && !impressionQueuedRef.current) {
            queueMovieImpression(dbId);
            impressionQueuedRef.current = true;
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [movie?.db_id]);

  return (
    <div ref={cardRef}>
      <ModalLink to={`/movies/${movieId}`}>
        <BaseCard hasActionArea>
          <BaseImage
            src={getImageUrl(movie.poster_path, { size: "w300" })}
            alt={movie.title}
            aspectRatio={getAspectRatioString(1, 1)}
          />
          <BaseCardHeader subheader={subheader} />
        </BaseCard>
      </ModalLink>
    </div>
  );
}

export default MovieCard;
