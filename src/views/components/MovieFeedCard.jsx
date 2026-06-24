import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@linaria/react';
import axios from 'axios';

import { FaRegHeart, FaHeart, FaRegComment } from 'react-icons/fa';

import BaseImage from 'views/components/BaseImage';
import ModalLink from 'views/components/ModalLink';
import BaseCardHeader from 'views/components/BaseCardHeader';
import CrossLayout from 'views/components/cross/CrossLayout';
import Impressions from 'views/components/Impressions';

import { getAspectRatioString } from 'views/components/AspectRatio';
import { useConfiguration } from 'views/components/ConfigurationProvider';
import { selectors } from 'core/reducers/index';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import { queueMovieImpression } from './movieImpressionQueue';



function MovieFeedCard({ movieId, subheader }) {
  const dispatch = useDispatch();
  const postRef = useRef(null);

  const movie = useSelector(state => selectors.selectMovie(state, movieId));
  const { getImageUrl } = useConfiguration();

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [impressionsCount, setImpressionsCount] = useState(0);

  const handleLike = async () => {
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount(c => c + (liked ? -1 : 1));
    try {
      const res = await axios.post(`${LITLOOP_API_URL}/movies/${movieId}/like/`, null, { headers: authHeader() });
      setLiked(res.data.liked);
      setLikesCount(res.data.likes_count);
    } catch (_) {
      setLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  // ─── Impressions ───
  const impressionQueuedRef = useRef(false);
  const visibleTimerRef = useRef(null);

  useEffect(() => {
    if (!postRef.current) return;
    const dbId = movie?.db_id;
    if (!dbId) return;
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting && !impressionQueuedRef.current) {
            visibleTimerRef.current = setTimeout(() => {
              if (dbId) queueMovieImpression(dbId);
              setImpressionsCount(c => c + 1);
              impressionQueuedRef.current = true;
            }, 3000);
          } else if (!entry.isIntersecting && visibleTimerRef.current) {
            clearTimeout(visibleTimerRef.current);
            visibleTimerRef.current = null;
          }
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(postRef.current);
    return () => {
      observer.disconnect();
      if (visibleTimerRef.current) clearTimeout(visibleTimerRef.current);
    };
  }, [movieId, movie?.db_id]);

  return (
    <Card ref={postRef}>
      <Wrapper>
        <CrossLayout avatars={[]} />
        <ProfileText>{movie.title}</ProfileText>
      </Wrapper>

      <Description>{movie.overview}</Description>

      <ModalLink to={`/movies/${movieId}`}>
        <BaseImage
          src={getImageUrl(movie.backdrop_path, { size: 'w780' })}
          alt={movie.title}
          aspectRatio={getAspectRatioString(1, 1)}
        />
      </ModalLink>

      <BaseCardHeader subheader={subheader} />

      <Stats>
        <Left>
          <LikeBtn onClick={handleLike}>
            {liked ? <StyledFaHeart /> : <StyledFaRegHeart />}
            <Count>{likesCount.toLocaleString()}</Count>
          </LikeBtn>
          <CommentBtn>
            <StyledFaRegComment />
          </CommentBtn>
        </Left>
        <Right>
          <Impressions count={impressionsCount} />
        </Right>
      </Stats>
    </Card>
  );
}



const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileText = styled.div`
  font-family: Verdana;
  cursor: pointer;
  justify-content: center;

  &:hover{
    text-decoration: underline;
  }
`;
const Description = styled.div`
  color: var(--text);
  font-family: Georgia, "Courier New", "system-ui";
  font-weight: 400;
  font-size: 14px;
  margin: 8px 0;
  line-height: 1.4;
`;

const Stats = styled.div`
  display: flex;
  margin-top: 10px;
  color: var(--text);
  column-gap: 8px;
  justify-content: space-between;
`;
const LikeBtn = styled.div`
  font-family: Helvetica Neue;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const CommentBtn = styled.div`
  font-family: Helvetica Neue;
  display: flex;
  align-items: center;
  margin-left: 26px;
`;
const Left = styled.div`
  display: flex;
  align-items: center;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
`;
const StyledFaRegHeart = styled(FaRegHeart)`
  margin-right: 6px;
  font-size: 20px;
  cursor: pointer;
`;
const StyledFaHeart = styled(FaHeart)`
  margin-right: 6px;
  font-size: 20px;
  cursor: pointer;
  color: #e74c3c;
`;
const StyledFaRegComment = styled(FaRegComment)`
  font-size: 20px;
  cursor: pointer;
`;
const Count = styled.span`
  margin-left: 6px;
  cursor: pointer;

  &:hover{
    text-decoration: underline;
  }
`;
const Card = styled.div`
  padding: 1em;
  padding-bottom: 4em;
  margin: 1em auto;

  width: 95%;
  max-width: 550px;
  border: 1.6px solid #383838;
  background: var(--cardColor);
  border-radius: 10px;

  @media screen and (max-width: 425px) {
    padding-bottom: 3em;
  }
`;

export default MovieFeedCard;
