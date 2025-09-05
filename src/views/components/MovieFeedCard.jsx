import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';

import { FaEye, FaRegHeart, FaRegComment } from 'react-icons/fa';
import { AiFillEye } from 'react-icons/ai';

import BaseImage from 'views/components/BaseImage';
import ModalLink from 'views/components/ModalLink';
import BaseCardHeader from 'views/components/BaseCardHeader';
import CrossLayout from 'views/components/cross/CrossLayout';

import { getAspectRatioString } from 'views/components/AspectRatio';
import { useConfiguration } from 'views/components/ConfigurationProvider';
import { selectors } from 'core/reducers/index';
import { albumText } from 'views/components/data/albumText.js';




function MovieFeedCard({ movieId, subheader }) {
  const dispatch = useDispatch();
  const postRef = useRef(null);

  const movie = useSelector(state => selectors.selectMovie(state, movieId));
  const movie_imdb = useSelector(state => selectors.selectImdbMovie(state, movieId));
  const { getImageUrl } = useConfiguration();

  const [showMore, setShowMore] = useState(false);

  // Generate text with <br/>
  const newText = albumText.split("<br/>").map((item, key) => <div key={key}>{item}<br/></div>);
  const newWithBrText = albumText.substring(0, 212).split("<br/>").map((item, key) => <div key={key}>{item}<br/></div>);

  // Persistent random stats
  const viewsRef = useRef(Math.floor(Math.random() * (999 - 99 + 1)) + 99);
  const likesRef = useRef(Math.floor(Math.random() * 1000) + 1);
  const commentsRef = useRef(Math.floor(50 + Math.random() * 400));

  const [views, setViews] = useState(viewsRef.current);
  const [likes] = useState(likesRef.current);
  const [comments] = useState(commentsRef.current);

  // Calculate scaled ratio (optional)
  const ratio = likes / views;
  const scaledRatio = 10 + (ratio * (30 - 10));
  const likesNumberNonFloat = Math.floor((views / scaledRatio) * 1000);

  // Intersection observer to increment views
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Increment persistent views
            viewsRef.current += 1;
            setViews(viewsRef.current);

            // Send to backend
            axios.post('http://localhost:8000/movies/up', {
              post_id: movieId,
              user_id: '1',
            }).catch(console.error);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 } // 50% visible
    );

    if (postRef.current) observer.observe(postRef.current);

    return () => observer.disconnect();
  }, [movieId]);

  return (
    <Card ref={postRef}>
      <Wrapper>
        <CrossLayout avatars={[]} />
        <ProfileText>Longusername</ProfileText>
      </Wrapper>

      <HeaderText onClick={() => setShowMore(!showMore)}>
        <div>
          {movie_imdb.imdbId}
          {showMore ? newText : newWithBrText}
          <ShowMore>{showMore ? "Show less" : "Show more"}</ShowMore>
        </div>
      </HeaderText>

      <ModalLink to={`/movies/${movieId}`}>
        <BaseImage
          src={getImageUrl(movie.backdrop_path, { size: 'w780' })}
          alt={movie.title}
          aspectRatio={getAspectRatioString(1, 1)}
        />
      </ModalLink>

      <BaseCardHeader subheader={subheader} />

      <Stats>
        <Right>
          <Likes>
            <StyledFaRegHeart />
            <Count>{likesNumberNonFloat.toLocaleString()}</Count>
          </Likes>
          <Comments>
            <StyledFaRegComment />
            <Count>{comments}</Count>
          </Comments>
        </Right>
        <Impressions>
          <StyledFaEye />
          <span>{views}K</span>
        </Impressions>
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
const HeaderText = styled.div`
  color: ${props => props.theme.text};
  cursor: pointer;
  font-family: Georgia, "Courier New", "system-ui" ;
  font-weight: 400;
  font-size: 16px;
`;
const ShowMore = styled.div`
  cursor: pointer;
  color: #347c8a;


  &:hover{
    text-decoration: underline;
  }
`;

const Stats = styled.div`
  display: flex;
  margin-top: 10px;
  color: ${props => props.theme.text};
  column-gap: 8px;
  justify-content: space-between;
`;
const Likes = styled.div`
  font-family: Helvetica Neue;
  display: flex;
  align-items: center;
`;
const Comments = styled.div`
  font-family: Helvetica Neue;
  display: flex;
  align-items: center;
`;
const Impressions = styled.div`
  display: flex;
  font-family: Helvetica Neue;
  align-items: center;
`;
const Profile = styled.div`

`;
const Right = styled.div`
  display: flex;
`;
const StyledFaEye = styled(FaEye)`
  margin-right: 6px;
`;
const StyledFaRegHeart = styled(FaRegHeart)`
  margin-right: 6px;
  font-size: 20px;
  cursor: pointer;
`;
const StyledFaRegComment = styled(FaRegComment)`
  margin-left: 26px;
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
const StyledAiFillEye = styled(AiFillEye)`
  margin-right: 6px;
`;
const Card = styled.div`
  padding-top: 1em;
  padding-right: 1em;
  padding-bottom: 4em;
  padding-left: 1em;
  margin-top: 1em;

  width: 550px;
  margin-left: 18%;
  border: 1.6px solid #383838;
  /* background: #1b1e22; */

  /* background: #222222; */

  background: ${props => props.theme.cardColor};
  /* padding-top: 5em;
  padding-right: 1em;
  padding-bottom: 4em;
  padding-left: 1em;
  margin-top: 1em; */
  border-radius: 10px;

  @media screen and (max-width: 425px) {
    width: 250px;
    margin-left: auto;
    margin-right: auto;
  }
`;

export default MovieFeedCard;
