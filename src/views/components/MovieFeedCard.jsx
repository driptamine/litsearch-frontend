import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components';
import axios from 'axios';

import { FaEye } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import { FaRegComment } from 'react-icons/fa';
import { AiFillEye } from 'react-icons/ai';

// MATERIAL DONE
// import { makeStyles } from "@mui/material/styles";


import BaseImage from "views/components/BaseImage";
import BaseCard from "views/components/BaseCard";
import RouterLink from "views/components/RouterLink";
import ModalLink from "views/components/ModalLink";
import BaseCardHeader from "views/components/BaseCardHeader";
import CrossLayout from "views/components/cross/CrossLayout";
import MovieRatingTag from "./MovieRatingTag";
import { getAspectRatioString } from "./AspectRatio";
import { useConfiguration } from "./ConfigurationProvider";

import offline_data from 'views/skeletons/data.json';

import { fetchMovieImdb } from "core/actions";
import { selectors } from "core/reducers/index";



const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

function MovieFeedCard({ movieId, subheader, observer, tracks }) {
// const MovieFeedCard = React.memo(({ movieId, subheader, observer, tracks }) => {

  // const classes = useStyles();
  const dispatch = useDispatch();

  const [showMore, setShowMore] = useState(false);

  const postRef = useRef(null);

  // const [tracks, setTracks] = useState(null);




  const movie = useSelector(state => selectors.selectMovie(state, movieId));
  const movie_imdb = useSelector(state => selectors.selectImdbMovie(state, movieId));

  const { getImageUrl } = useConfiguration();

  const text = "Future — «Dirty Sprite 2» <br/> Genre: Hip-Hop <br/> Label: «Freebandz», «Epic Records» <br/> Full: vk.cc/3ZW6mm | Download: vk.cc/3ZW7PZ  <br/><br/> Космический аппарат NASA «New Horizons» приблизился к Плутону в ту неделю, в которую выходит альбом Future, — отличный маркетинговый ход для исполнителя, коего всегда ассоциировали с загадочной планетой и некой атмосферой нахождения на краю Солнечной системы со стаканом сиропа в руке. После святой троицы успешных микстейпов, ставших открытием конца 2014 — начала 2015 годов, Fewtch подготовил для наевшихся новинками фанатов ещё один сюрприз — пластинку «Dirty Sprite 2». <br/><br/> В первую очередь Фьючер удивляет способностью делать из своего неумения петь и писать заумные тексты плюсы. Его хриплый голос под автотюном звучит не пафосно и противно, а меланхолично и отчаянно; его строчки насыщены честностью и чувствами, которых не найдёшь у других рэперов из Атланты. Артист признаётся в зависимости от кодеина и измене, пытаясь объяснить, что все те девушки ничего не значат, они лишь на одну ночь, а любит он Сиару и думает только о ней, даже когда другая барышня делает ему минет. <br/><br/> Погрязший в наркотических да любовных проблемах, сказавшихся на моральном состоянии, парень скрывает страхи и переживания, тратя очередную пачку денег в стрип-клубе «Magic City», покупая роскошные машины или заливая в рот «purple drank». <br/><br/> Назовёте ли вы сходу исполнителя, за 5 лет карьеры создавшего больше качественного материала, чем Future? Сомневаемся. Молодой Хендрикс неоднократно заявлял о себе: с 2011 по 2015 — каждый год мы слышали его на одном или нескольких хитах. Последним достижением Найвадиуса, конечно, является бесплатный тейп «Monster», вкупе с «Beast Mode» и «56 Nights» поднявший востребованность и «модность» артиста до небес. <br/><br/> «DS2» стал не просто достойным продолжением оригинала: он его переплюнул, позволил рэперу показать, какой прогресс достигнут за долгие годы упорного труда. Возьмите по частичке от каждого релиза из недавней трилогии и добавьте туда некоторых достоинств «Honest» — на выходе данный лонгпей. Переполненный хитами, не лишённый лиричных композиций и, пусть немного однообразный, умудряющийся удерживать внимание слушателей на протяжении 60 минут. Хотелось бы «News Or Somthn» видеть в треклисте, но, похоже, придётся довольствоваться тем качеством, что есть. Если кто-то сомневается в том, что продуктивность и качество могут сосуществовать, то милости просим к столу. На подходе ещё и «Ape Shit» — не забывайте. Fewtch поклонникам умереть от жажды не даст никогда. <br/><br/> «Had to scrub to get where I'm at or sell dope, Jackie Chan moves got game in the choke. Gas rolling up and the blunt from the coast, 12 jumpers came in the spot to open up the dope»";

  const newText = text.split("<br/>").map((item, key) => {
    return (
      <div key={key}>
        {item}
        <br />

      </div>
    );
  });
  const newWithBrText = text.substring(0, 212).split("<br/>").map((item, key) => { return (<div key={key}>{item}<br/></div>);});

  const endpoint = 'http://localhost:8000/post/impression';
  const endpointV1 = 'http://localhost:8000/movies/up';

  const formData = axios.toFormData({
    "post_id": movieId,
    "user_id": '1',

  });

  const customViewport = document.querySelector('#custom-viewport');

  const [avatars, setAvatars] = useState([]);
  const hasFetched = useRef(false);

  // useEffect(() => {
  //   if (hasFetched.current) return; // ✅ Stops multiple calls
  //   hasFetched.current = true;
  //
  //   axios.get("https://reqres.in/api/users?page=1")
  //     .then(response => {
  //       const fetchedAvatars = response.data.data.slice(0, 5).map(user => user.avatar);
  //       setAvatars(fetchedAvatars);
  //     })
  //     .catch(error => console.error("Error fetching avatars:", error));
  // }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is in viewport, track impression here
            console.log(`Post is in viewport ${movieId}`);

            axios({
              method: "post",
              url: endpointV1,
              data: formData,
              // headers: { ... }
            })

            // fetch(`http://localhost:8000/post/${movieId}/impression`);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null, // Use the viewport as the root
        // root: customViewport, // Custom ViewPort
        threshold: 1.0, // 50% visibility is considered as intersection
      }
    );

    // if (postRef.current) {
    //   observer.observe(postRef.current);
    // }

    return () => {
      // Clean up the observer when the component unmounts
      observer.disconnect();
    };
  }, []);

  // useEffect(() => {
    // dispatch(fetchMovieImdb(imdbId, REQUIRED_FIELDS));
  // }, [movieId, dispatch]);

  const randomLikes = Math.floor(99 + Math.random() * 9900);
  // const randomFloat = 10 + Math.random() * 89;
  const randomViewsFloat = (Math.floor(99 + Math.random() * 899) * 10 + Math.floor(Math.random() * 10)) / 10;
  const randomLikesFloat = (Math.floor(10 + Math.random() * 89) * 10 + Math.floor(Math.random() * 10)) / 10;
  const randomComments = (Math.floor(50 + Math.random() * 400) * 10 + Math.floor(Math.random() * 10)) / 10;


  // Generate random views and likes numbers
  const minViews = 99;
  const maxViews = 999;
  const views = Math.floor(Math.random() * (maxViews - minViews + 1)) + minViews; // Random number between 99 and 999
  const likes = Math.floor(Math.random() * 1000) + 1; // Random number between 1 and 1000

  // Calculate the ratio
  const ratio = likes / views;

  // Calculate the scaled ratio within the range 10-30
  const minRatio = 10;
  const maxRatio = 30;
  const scaledRatio = minRatio + (ratio * (maxRatio - minRatio));


  const likesNumber = (views / scaledRatio)*1000
  const likesNumberNonFloat = Math.floor(likesNumber)
  const randomCommentsNonFloat = Math.floor(randomComments)







  return (



        <Card hasActionArea ref={postRef}>

            {/*{profile_image}*/}
          <Wrapper>
            <CrossLayout avatars={avatars} />
            <ProfileText>
              Longusername
            </ProfileText>
          </Wrapper>

          <HeaderText onClick={() => setShowMore(!showMore)}>
            <div>
              {movie_imdb.imdbId}
              {showMore ? newText : newWithBrText}
              <ShowMore className="btn" >
                {showMore ? "Show less" : "Show more"}
              </ShowMore>
            </div>
          </HeaderText>

          <ModalLink to={`/movies/${movieId}`}>
            <BaseImage
              src={getImageUrl(movie.backdrop_path, { original: true })}
              alt={movie.title}
              // aspectRatio={getAspectRatioString(2, 3)}
              // aspectRatio={getAspectRatioString(3, 3)}
              aspectRatio={getAspectRatioString(1, 1)}
            />
          </ModalLink>
          {/*<div style={{ position: "absolute", top: 0, left: 0 }}>
            <MovieRatingTag movieId={movieId} />
          </div>*/}
          {/*<BaseCardHeader title={movie.title} subheader={subheader} />*/}
          <BaseCardHeader  subheader={subheader} />



          <Stats>
            <Right>
              <Likes>
                <StyledFaRegHeart />
                <Count>{likesNumberNonFloat.toLocaleString()}</Count>
              </Likes>
              <Comments>
                <StyledFaRegComment />
                <Count>{randomCommentsNonFloat}</Count>
              </Comments>
            </Right>

            <Impressions>
              <StyledFaEye/>
              <span>{randomViewsFloat}K</span>
            </Impressions>
          </Stats>
        </Card>


  );
}




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
