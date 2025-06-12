import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { fetchPopularMovies, fetchPopularAlbums } from 'core/actions';
import { selectors } from 'core/reducers/index';
import MovieCard from 'views/components/MovieCard';
import AlbumItem from 'views/components/AlbumItem';
import InfiniteGridList from 'views/components/InfiniteGridList';
import InfiniteList from 'views/components/InfiniteList';

const StyledLi = styled.li`
  width: 550px;
  margin-left: 18%;
  border: 1.6px solid #383838;
  /* background: #1b1e22; */
  background: ${props => props.theme.cardColor};
  padding-top: 6em;
  padding-right: 1em;
  padding-bottom: 4em;
  padding-left: 1em;
  margin-top: 1em;
  border-radius: 10px;
`;
const HeaderText = styled.div`
  color: ${props => props.theme.text};
  cursor: pointer;
  font-family: Helvetica Neue;
  font-weight: 400;
`;
const ShowMore = styled.div`
  cursor: pointer;
  color: #673ab7;


  &:hover{
    text-decoration: underline;
  }
`;

function renderItem(albumId) {
  const [showMore, setShowMore] = useState(false);
  const data = [
    {
      text: "dasdasds"
    },
    {
      text: ""
    }
  ]
  // const text = "Lil Yachty & Blood Orange — «The Deep End» <br/><br/>  Ввиду мультижанрового подхода к музыке и незаурядных творческих способностей неизданный материал Lil Yachty вызывает большой интерес у его слушателей. <br/><br/> Свежий «анрелиз» также придётся по вкусу поклонникам таланта нью-йоркского артиста Blood Orange — его вокал украшает безмятежную композицию «The Deep End». <br/> #ffmunreleased@fastfoodmusic";

  const text = "Future — «Dirty Sprite 2» <br/> Genre: Hip-Hop <br/> Label: «Freebandz», «Epic Records» <br/> Full: vk.cc/3ZW6mm | Download: vk.cc/3ZW7PZ  <br/><br/> Космический аппарат NASA «New Horizons» приблизился к Плутону в ту неделю, в которую выходит альбом Future, — отличный маркетинговый ход для исполнителя, коего всегда ассоциировали с загадочной планетой и некой атмосферой нахождения на краю Солнечной системы со стаканом сиропа в руке. После святой троицы успешных микстейпов, ставших открытием конца 2014 — начала 2015 годов, Fewtch подготовил для наевшихся новинками фанатов ещё один сюрприз — пластинку «Dirty Sprite 2». <br/><br/> В первую очередь Фьючер удивляет способностью делать из своего неумения петь и писать заумные тексты плюсы. Его хриплый голос под автотюном звучит не пафосно и противно, а меланхолично и отчаянно; его строчки насыщены честностью и чувствами, которых не найдёшь у других рэперов из Атланты. Артист признаётся в зависимости от кодеина и измене, пытаясь объяснить, что все те девушки ничего не значат, они лишь на одну ночь, а любит он Сиару и думает только о ней, даже когда другая барышня делает ему минет. <br/><br/> Погрязший в наркотических да любовных проблемах, сказавшихся на моральном состоянии, парень скрывает страхи и переживания, тратя очередную пачку денег в стрип-клубе «Magic City», покупая роскошные машины или заливая в рот «purple drank». <br/><br/> Назовёте ли вы сходу исполнителя, за 5 лет карьеры создавшего больше качественного материала, чем Future? Сомневаемся. Молодой Хендрикс неоднократно заявлял о себе: с 2011 по 2015 — каждый год мы слышали его на одном или нескольких хитах. Последним достижением Найвадиуса, конечно, является бесплатный тейп «Monster», вкупе с «Beast Mode» и «56 Nights» поднявший востребованность и «модность» артиста до небес. <br/><br/> «DS2» стал не просто достойным продолжением оригинала: он его переплюнул, позволил рэперу показать, какой прогресс достигнут за долгие годы упорного труда. Возьмите по частичке от каждого релиза из недавней трилогии и добавьте туда некоторых достоинств «Honest» — на выходе данный лонгпей. Переполненный хитами, не лишённый лиричных композиций и, пусть немного однообразный, умудряющийся удерживать внимание слушателей на протяжении 60 минут. Хотелось бы «News Or Somthn» видеть в треклисте, но, похоже, придётся довольствоваться тем качеством, что есть. Если кто-то сомневается в том, что продуктивность и качество могут сосуществовать, то милости просим к столу. На подходе ещё и «Ape Shit» — не забывайте. Fewtch поклонникам умереть от жажды не даст никогда. <br/><br/> «Had to scrub to get where I'm at or sell dope, Jackie Chan moves got game in the choke. Gas rolling up and the blunt from the coast, 12 jumpers came in the spot to open up the dope»";

  const newText = text.split("<br/>").map((item, key) => {
    return (
      <div key={key}>
        {item}
        <br />
      </div>
    );
  });
  const newWithBrText = text.substring(0, 150).split("<br/>").map((item, key) => { return (<div key={key}>{item}</div>);});

  return (
    <StyledLi className="AlbumFeedItem">
      <HeaderText onClick={() => setShowMore(!showMore)}>
        <div>
          {/*{showMore ? newText : `${text.substring(0, 150).split("<br/>").map((item, key) => { return (<div key={key}>{item}<br /></div>);})}`}*/}
          {/*{showMore ? newText : `${text.replace(/<br\s*\/?>/gi, "\n").substring(0, 150)}`}*/}
          {showMore ? newText : newWithBrText}
          <ShowMore className="btn" >
            {showMore ? "Show less" : "Show more"}
          </ShowMore>
        </div>
      </HeaderText>

      <AlbumItem albumId={albumId} />

    </StyledLi>
  );
}

function PopularAlbums() {
  const dispatch = useDispatch();
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingPopularAlbums(state)
  );
  const nextPage = useSelector(state =>
    selectors.selectPopularAlbumsNextPage(state)
  );
  const albumIds = useSelector(state => selectors.selectPopularAlbumIds(state));

  function handleLoadMore() {
    // dispatch(fetchPopularMovies(nextPage));
    dispatch(fetchPopularAlbums(nextPage));
  }

  return (
    <InfiniteList
      items={albumIds}
      loading={isFetching}
      hasNextPage={!!nextPage}
      onLoadMore={handleLoadMore}
      renderItem={renderItem}
    />
  );
}

export default PopularAlbums;
