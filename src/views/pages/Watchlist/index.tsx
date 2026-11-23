import React, { useState, useEffect, useCallback } from 'react';
import { styled } from '@linaria/react';
import { Link } from 'react-router-dom';
import { FaThList, FaTh, FaRandom } from 'react-icons/fa';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import useSelectAuthUser from 'core/hooks/useSelectAuthUser';

const WatchlistPage = () => {
  const { authUser } = useSelectAuthUser();
  const username = authUser?.username || authUser?.user?.username || authUser?.user__username;

  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [shuffleMode, setShuffleMode] = useState(false);

  const fetchWatchlist = useCallback(() => {
    if (!username) return;
    setLoading(true);
    setError('');
    axios.get(`${LITLOOP_API_URL}/movies/${username}/watchlist/?page=${page}&page_size=20`, {
      headers: authHeader(),
    })
      .then(res => {
        setItems(res.data.results || []);
        setCount(res.data.count || 0);
        setTotalPages(res.data.total_pages || 1);
      })
      .catch(err => {
        setError(err.response?.data?.error || err.message || 'Failed to load watchlist');
      })
      .finally(() => setLoading(false));
  }, [username, page]);

  const fetchShuffled = useCallback(() => {
    if (!username) return;
    setLoading(true);
    setError('');
    axios.get(`${LITLOOP_API_URL}/movies/watchlist/ammy_shuffle/`, {
      headers: authHeader(),
    })
      .then(res => {
        setItems(res.data.results || []);
        setCount(res.data.count || 0);
        setTotalPages(1);
      })
      .catch(err => {
        setError(err.response?.data?.error || err.message || 'Failed to shuffle watchlist');
      })
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    if (!shuffleMode) {
      fetchWatchlist();
    }
  }, [fetchWatchlist, shuffleMode]);

  const handleShuffle = () => {
    setShuffleMode(true);
    setPage(1);
    fetchShuffled();
  };

  const handleBackToWatchlist = () => {
    setShuffleMode(false);
    setPage(1);
  };

  const handleReshuffle = () => {
    fetchShuffled();
  };

  return (
    <Container $viewMode={viewMode}>
      <Header>
        <Title>{shuffleMode ? 'Shuffled Watchlist' : 'Watchlist'}</Title>
        <HeaderRight>
          <ShuffleBtn onClick={shuffleMode ? handleReshuffle : handleShuffle}>
            <FaRandom /> {shuffleMode ? 'Reshuffle' : 'Shuffle'}
          </ShuffleBtn>
          {shuffleMode && (
            <BackBtn onClick={handleBackToWatchlist}>Watchlist</BackBtn>
          )}
          <ViewToggle>
            <ViewBtn active={viewMode === 'list'} onClick={() => setViewMode('list')}>
              <FaThList />
            </ViewBtn>
            <ViewBtn active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
              <FaTh />
            </ViewBtn>
          </ViewToggle>
          <ImportLink to="/import-watchlist">Import</ImportLink>
        </HeaderRight>
      </Header>

      {!username && <EmptyText>Sign in to view your watchlist</EmptyText>}
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {loading && <LoadingText>Loading...</LoadingText>}

      {!loading && !error && items.length === 0 && username && (
        <EmptyText>Your watchlist is empty.</EmptyText>
      )}

      {items.length > 0 && (
        <>
          <Count>{count} movies</Count>
          <CardsWrapper viewMode={viewMode}>
            {items.map(item => (
              <Card key={item.imdb_id} viewMode={viewMode}>
                <CardTitle>{item.title}</CardTitle>
                <CardMeta>
                  {item.year && <span>{item.year}</span>}
                  {item.imdb_rating && <span>IMDb: {item.imdb_rating}</span>}
                  {item.your_rating && <span>Your rating: {item.your_rating}</span>}
                  {item.date_rated && <span>Rated: {item.date_rated}</span>}
                  {item.genres && <Genres>{item.genres}</Genres>}
                </CardMeta>
              </Card>
            ))}
          </CardsWrapper>

          {!shuffleMode && totalPages > 1 && (
            <Pagination>
              <PageBtn disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                Previous
              </PageBtn>
              <PageInfo>Page {page} of {totalPages}</PageInfo>
              <PageBtn disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                Next
              </PageBtn>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: ${({ $viewMode }) => $viewMode === 'grid' ? '1000px' : '700px'};
  margin: 2em auto;
  padding: 0 1em;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5em;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid #444;
  border-radius: 8px;
  overflow: hidden;
`;

const ViewBtn = styled.button`
  background: ${({ active }) => active ? '#686cb9' : 'transparent'};
  border: none;
  color: ${({ active }) => active ? 'white' : '#888'};
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: ${({ active }) => active ? '#686cb9' : '#333'};
  }
`;

const Title = styled.h1`
  color: white;
  font-family: Verdana;
  font-size: 24px;
  margin: 0;
`;

const ShuffleBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5em;
  background: ${({ active }) => active ? '#686cb9' : 'transparent'};
  border: 1px solid #686cb9;
  border-radius: 8px;
  padding: 8px 14px;
  color: #686cb9;
  font-family: Verdana;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #686cb9;
    color: white;
  }
`;

const BackBtn = styled.button`
  background: transparent;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 8px 14px;
  color: #aaa;
  font-family: Verdana;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    border-color: #888;
    color: white;
  }
`;

const ImportLink = styled(Link)`
  display: inline-block;
  background: #686cb9;
  border-radius: 8px;
  padding: 10px 20px;
  color: white;
  font-family: Verdana;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;

  &:hover {
    background: #7b7fcf;
  }
`;

const Count = styled.p`
  color: #888;
  font-family: Verdana;
  font-size: 13px;
  margin: 0 0 1em 0;
`;

const CardsWrapper = styled.div`
  display: ${({ viewMode }) => viewMode === 'grid' ? 'grid' : 'block'};
  grid-template-columns: ${({ viewMode }) => viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'none'};
  gap: ${({ viewMode }) => viewMode === 'grid' ? '1em' : '0'};
`;

const Card = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 1em;
  margin-bottom: ${({ viewMode }) => viewMode === 'grid' ? '0' : '0.75em'};
  break-inside: avoid;
`;

const CardTitle = styled.h3`
  color: white;
  font-family: Verdana;
  font-size: 16px;
  margin: 0 0 0.4em 0;
`;

const CardMeta = styled.div`
  color: #888;
  font-family: Verdana;
  font-size: 13px;
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
`;

const Genres = styled.span`
  color: #686cb9;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  margin-top: 1.5em;
`;

const PageBtn = styled.button`
  background: #333;
  border: 1px solid #555;
  border-radius: 6px;
  padding: 8px 16px;
  color: white;
  font-family: Verdana;
  font-size: 13px;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }

  &:hover:not(:disabled) {
    background: #444;
  }
`;

const PageInfo = styled.span`
  color: #888;
  font-family: Verdana;
  font-size: 13px;
`;

const EmptyText = styled.p`
  color: #888;
  font-family: Verdana;
  font-size: 14px;
  text-align: center;
  margin-top: 3em;
`;

const LoadingText = styled.p`
  color: #888;
  font-family: Verdana;
  font-size: 14px;
  text-align: center;
  margin-top: 3em;
`;

const ErrorMsg = styled.p`
  color: #f87171;
  font-family: Verdana;
  font-size: 14px;
  text-align: center;
  margin-top: 1em;
`;

export default WatchlistPage;
