import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@linaria/react';

import { fetchPopularMagazines } from 'core/actions';
import { selectors } from 'core/reducers/index';
// import MagazineFeedCard from 'views/components/MagazineFeedCard';
import MagazineCard from 'views/components/MagazineCard';
import InfiniteGridList from 'views/components/InfiniteGridList';
import InfiniteList from 'views/components/InfiniteList';

const StyledLi = styled.li`
  padding: 1em;
  padding-bottom: 4em;
  margin: 1em auto;

  width: 95%;
  max-width: 550px;
  border: 1.6px solid #383838;
  background: #222222;
  border-radius: 10px;

  @media screen and (max-width: 425px) {
    padding-bottom: 3em;
  }
`;
const HeaderText = styled.div`
  color: white;
  cursor: pointer;
  font-family: Helvetica Neue;
  font-weight: 400;
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
  color: white;
  column-gap: 8px;
  justify-content: space-between;
`;
const Likes = styled.div`

`;
const Comments = styled.div`

`;
const Impressions = styled.div`

`;

// function renderItem(magazineId) {
//   // https://chayanit-chaisri.medium.com/react-create-a-show-more-less-button-aa0e9cd0f927
//   return (
//     <StyledLi>
//
//       <MagazineFeedCard magazineId={magazineId} />
//
//     </StyledLi>
//   );
// }

function renderGridItem(magazineId) {
  return (
    <li>
      <MagazineCard magazineId={magazineId} />

    </li>
  );
}

function PopularMagazines() {

  const paragraphObserver = React.useRef(null);

  const dispatch = useDispatch();
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingPopularMagazines(state)
  );
  const nextPage = useSelector(state =>
    selectors.selectPopularMagazinesNextPage(state)
  );
  const magazineIds = useSelector(state => selectors.selectPopularMagazineIds(state));

  function handleLoadMore() {
    dispatch(fetchPopularMagazines(nextPage));
  }

  useEffect(() => {

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {

          if (entry.intersectionRatio) {
            // callback('WOW-------------------' + entry.target);
            console.log('WOW-------------------' );
            const url = 'http://localhost:8000/';
            fetch(url)
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 1.00 }
    );
    paragraphObserver.current = observer;
  }, []);

  function renderItem(magazineId) {

    // https://chayanit-chaisri.medium.com/react-create-a-show-more-less-button-aa0e9cd0f927
    return (
      // <StyledLi>

        // <MagazineFeedCard
        <MagazineCard
          magazineId={magazineId}
          observer={paragraphObserver.current}
        />

      // </StyledLi>
    );
  }

  return (
    // <InfiniteList
    <InfiniteGridList
      items={magazineIds}
      loading={isFetching}
      hasNextPage={!!nextPage}
      onLoadMore={handleLoadMore}
      renderItem={renderItem}
    />
  );
}

export default PopularMagazines;
