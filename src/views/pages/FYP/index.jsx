import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { styled } from '@linaria/react';
import { Link } from 'react-router-dom';
import { useConfiguration } from 'views/components/ConfigurationProvider';
import useDetectMobile from 'core/hooks/useDetectMobile';
import { LITLOOP_API_URL } from 'core/constants/urls';

const API_KEY = import.meta.env.TMDB_API_KEY;

function FYP() {
  const [movies, setMovies] = useState([]);
  const [memes, setMemes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const loadMoreRef = useRef(null);
  const loadingRef = useRef(false);
  const isMobile = useDetectMobile();
  const { getImageUrl } = useConfiguration();

  const backdropSize = isMobile ? 'w300' : 'w780';
  const posterSize = isMobile ? 'w300' : 'w780';

  useEffect(() => {
    axios.get(`${LITLOOP_API_URL}/memes/`)
      .then(res => setMemes(res.data))
      .catch(() => {});
  }, []);

  const fetchMovies = useCallback(async (currentPage) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
        params: { api_key: API_KEY, language: 'en-US', page: currentPage }
      });
      setMovies(prev => [...prev, ...response.data.results]);
      setHasNextPage(response.data.total_pages > currentPage);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || loading) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(p => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, loading]);

  const getMemeAt = (index) => {
    if (memes.length === 0) return null;
    return memes[index % memes.length];
  };

  const renderGrid = () => {
    const groups = [];
    for (let i = 0; i < movies.length; i += 5) {
      groups.push(movies.slice(i, i + 5));
    }

    return groups.map((group, groupIndex) => {
      const isPatternA = groupIndex % 2 === 0;

      if (isPatternA) {
        const [tall, sq1, sq2, sq3, sq4] = group;
        const meme = getMemeAt(groupIndex * 3);
        const mem = getMemeAt(groupIndex * 3 + 1);
        return (
          <GridContainer key={groupIndex}>
            <CellTall style={{ gridColumn: 1, gridRow: '1 / 3' }}>
              <MovieLink to={`/movies/${tall.id}`}>
                <MovieImage src={getImageUrl(tall.poster_path, { size: posterSize })} alt={tall.title} />
                <MovieTitle>{tall.title}</MovieTitle>
              </MovieLink>
            </CellTall>
            <CellSquare style={{ gridColumn: 2, gridRow: 1 }}>
              {sq1 && (
                <MovieLink to={`/movies/${sq1.id}`}>
                  <MovieImage src={getImageUrl(sq1.backdrop_path, { size: backdropSize })} alt={sq1.title} />
                  <MovieTitle>{sq1.title}</MovieTitle>
                </MovieLink>
              )}
            </CellSquare>
            <CellSquare style={{ gridColumn: 2, gridRow: 2 }}>
              {sq2 && (
                <MovieLink to={`/movies/${sq2.id}`}>
                  <MovieImage src={getImageUrl(sq2.backdrop_path, { size: backdropSize })} alt={sq2.title} />
                  <MovieTitle>{sq2.title}</MovieTitle>
                </MovieLink>
              )}
            </CellSquare>
            <CellSquare style={{ gridColumn: 3, gridRow: 1 }}>
              {meme ? (
                <MemeLink to={`/p/${groupIndex * 3}`}>
                  <CellImage src={meme?.url} alt={meme.title} />
                  <MovieTitle>{meme.title}</MovieTitle>
                </MemeLink>
              ) : sq3 && (
                <MovieLink to={`/movies/${sq3.id}`}>
                  <MovieImage src={getImageUrl(sq3.backdrop_path, { size: backdropSize })} alt={sq3.title} />
                  <MovieTitle>{sq3.title}</MovieTitle>
                </MovieLink>
              )}
            </CellSquare>
            <CellSquare style={{ gridColumn: 3, gridRow: 2 }}>
            {mem ? (
              <MemeLink to={`/p/${groupIndex * 3 + 1}`}>
                <CellImage src={mem?.url} alt={mem.title} />
                  <MovieTitle>{mem.title}</MovieTitle>
                </MemeLink>
              ) : sq4 && (
                <MovieLink to={`/movies/${sq4.id}`}>
                  <MovieImage src={getImageUrl(sq4.backdrop_path, { size: backdropSize })} alt={sq4.title} />
                  <MovieTitle>{sq4.title}</MovieTitle>
                </MovieLink>
              )}
            </CellSquare>
          </GridContainer>
        );
      }

      const [sq1, sq2, sq3, sq4, tall] = group;
      const meme = getMemeAt(groupIndex * 3);
      const mem = getMemeAt(groupIndex * 3 + 1);
      const memz = getMemeAt(groupIndex * 3 + 2);
      return (
        <GridContainer key={groupIndex}>
          <CellSquare style={{ gridColumn: 1, gridRow: 1 }}>
            {meme ? (
              <MemeLink to={`/p/${groupIndex * 3}`}>
                <CellImage src={meme?.url} alt={meme.title} />
                <MovieTitle>{meme.title}</MovieTitle>
              </MemeLink>
            ) : sq1 && (
              <MovieLink to={`/movies/${sq1.id}`}>
                <MovieImage src={getImageUrl(sq1.backdrop_path, { size: backdropSize })} alt={sq1.title} />
                <MovieTitle>{sq1.title}</MovieTitle>
              </MovieLink>
            )}
          </CellSquare>
          <CellSquare style={{ gridColumn: 1, gridRow: 2 }}>
            {mem ? (
              <MemeLink to={`/p/${groupIndex * 3 + 1}`}>
                <CellImage src={mem?.url} alt={mem.title} />
                <MovieTitle>{mem.title}</MovieTitle>
              </MemeLink>
            ) : sq2 && (
              <MovieLink to={`/movies/${sq2.id}`}>
                <MovieImage src={getImageUrl(sq2.backdrop_path, { size: backdropSize })} alt={sq2.title} />
                <MovieTitle>{sq2.title}</MovieTitle>
              </MovieLink>
            )}
          </CellSquare>
          <CellSquare style={{ gridColumn: 2, gridRow: 1 }}>
            {sq3 && (
              <MovieLink to={`/movies/${sq3.id}`}>
                <MovieImage src={getImageUrl(sq3.backdrop_path, { size: backdropSize })} alt={sq3.title} />
                <MovieTitle>{sq3.title}</MovieTitle>
              </MovieLink>
            )}
          </CellSquare>
          <CellSquare style={{ gridColumn: 2, gridRow: 2 }}>
            {sq4 && (
              <MovieLink to={`/movies/${sq4.id}`}>
                <MovieImage src={getImageUrl(sq4.backdrop_path, { size: backdropSize })} alt={sq4.title} />
                <MovieTitle>{sq4.title}</MovieTitle>
              </MovieLink>
            )}
          </CellSquare>
          <CellTall style={{ gridColumn: 3, gridRow: '1 / 3' }}>
            {memz ? (
              <MemeLink to={`/p/${groupIndex * 3 + 2}`}>
                <CellImage src={memz?.url} alt={memz.title} />
                <MovieTitle>{memz.title}</MovieTitle>
              </MemeLink>
            ) : tall && (
              <MovieLink to={`/movies/${tall.id}`}>
                <MovieImage src={getImageUrl(tall.poster_path, { size: posterSize })} alt={tall.title} />
                <MovieTitle>{tall.title}</MovieTitle>
              </MovieLink>
            )}
          </CellTall>
        </GridContainer>
      );
    });
  };

  return (
    <PageWrapper>
      {renderGrid()}
      {loading && <Loading>Loading...</Loading>}
      {hasNextPage && !loading && <LoadMoreTrigger ref={loadMoreRef} />}
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 2px;
  margin-bottom: 2px;
`;

const cellBase = `
  border-radius: 0px;
  overflow: hidden;
  background: var(--cardColor, #222);
  position: relative;
`;

const CellSquare = styled.div`
  ${cellBase}
  aspect-ratio: 1 / 1;
`;

const CellTall = styled.div`
  ${cellBase}
`;

const MovieLink = styled(Link)`
  text-decoration: none;
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
`;

const MemeLink = styled(Link)`
  text-decoration: none;
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
`;

const MovieImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const CellImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const MovieTitle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 20px;
  color: var(--text, #FAFAFA);
`;

const LoadMoreTrigger = styled.div`
  height: 20px;
`;

export default FYP;
