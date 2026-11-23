import React, { useState, useEffect } from 'react';
import { styled } from '@linaria/react';
import { Link } from 'react-router-dom';
import { FaThList, FaTh } from 'react-icons/fa';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import useSelectAuthUser from 'core/hooks/useSelectAuthUser';

const RatingsPage = () => {
  const { authUser } = useSelectAuthUser();
  const username = authUser?.username || authUser?.user?.username || authUser?.user__username;

  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError('');
    axios.get(`${LITLOOP_API_URL}/movies/${username}/ratings/?page=${page}&page_size=20`, {
      headers: authHeader(),
    })
      .then(res => {
        setItems(res.data.results || []);
        setCount(res.data.count || 0);
        setTotalPages(res.data.total_pages || 1);
      })
      .catch(err => {
        setError(err.response?.data?.error || err.message || 'Failed to load ratings');
      })
      .finally(() => setLoading(false));
  }, [username, page]);

  return (
    <Container $viewMode={viewMode}>
      <Header>
        <Title>Ratings</Title>
        <HeaderRight>
          <ViewToggle>
            <ViewBtn active={viewMode === 'list'} onClick={() => setViewMode('list')}>
              <FaThList />
            </ViewBtn>
            <ViewBtn active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
              <FaTh />
            </ViewBtn>
          </ViewToggle>
          <ImportLink to="/import-ratings">Import Ratings</ImportLink>
        </HeaderRight>
      </Header>

      {!username && <EmptyText>Sign in to view your ratings</EmptyText>}
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {loading && <LoadingText>Loading...</LoadingText>}

      {!loading && !error && items.length === 0 && username && (
        <EmptyText>No ratings yet.</EmptyText>
      )}

      {items.length > 0 && (
        <>
          <Count>{count} ratings</Count>
          <CardsWrapper viewMode={viewMode}>
            {items.map(item => (
              <Card key={item.imdb_id} viewMode={viewMode}>
                <CardTitle>{item.title}</CardTitle>
                <CardMeta>
                  {item.year && <span>{item.year}</span>}
                  {item.imdb_rating && <span>IMDb: {item.imdb_rating}</span>}
                  {item.rating && <span>Your rating: {item.rating}</span>}
                  {item.date_rated && <span>Rated: {item.date_rated}</span>}
                  {item.genres && <Genres>{item.genres}</Genres>}
                </CardMeta>
              </Card>
            ))}
          </CardsWrapper>

          {totalPages > 1 && (
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

export default RatingsPage;
