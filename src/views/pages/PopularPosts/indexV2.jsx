import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';

function PopularMoviesNewsFeed() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const loadMoreRef = useRef(null);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const contentRef = useRef(null); // Ref to the main content container
  const scrollPosition = useRef(0); // Ref to store the scroll position

  const observer = useRef();
  const apiKey = 'bceb6c0fefae8ee5a3cf9762ec780d63'; // Replace with your actual API key
  const imageBaseUrl = 'https://image.tmdb.org/t/p/original/';

  const fetchPopularMovies = useCallback(async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate a delay for demonstration purposes
      await new Promise((resolve) => setTimeout(resolve, 500)); // Adjust the delay time

      const response = await axios.get(
        'https://api.themoviedb.org/3/movie/popular',
        {
          params: {
            api_key: apiKey,
            language: 'en-US',
            page: currentPage,
          },
        }
      );
      if (currentPage === 1) {
        setMovies(response.data.results);
      } else {
        setMovies((prevMovies) => {
          // Store the current scroll position before updating movies
          if (contentRef.current) {
            scrollPosition.current = contentRef.current.scrollTop;
          }
          return [...prevMovies, ...response.data.results];
        });
      }
      setHasNextPage(response.data.total_pages > currentPage);
      setLoading(false);
      setLoadingSkeleton(false);
    } catch (err) {
      console.error('Error fetching popular movies:', err);
      setError(err);
      setLoading(false);
      setLoadingSkeleton(false);
    }
  }, [apiKey]);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !loading && !error) {
        setPage((prevPage) => prevPage + 1);
      }
    },
    [hasNextPage, loading, error, setPage]
  );

  useEffect(() => {
    if (loading || error) return;

    const currentObserver = observer.current;
    if (loadMoreRef.current) {
      observer.current = new IntersectionObserver(handleObserver);
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (currentObserver) currentObserver.disconnect();
    };
  }, [loading, error, handleObserver]);

  useEffect(() => {
    fetchPopularMovies(page);
  }, [fetchPopularMovies, page]);

  // Restore scroll position after movies state is updated (after loading new data)
  useEffect(() => {
    if (!loading && page > 1 && contentRef.current) {
      contentRef.current.scrollTop = scrollPosition.current;
    }
  }, [movies, loading, page]);

  if (loading && page === 1) {
    return <LoadingMore>Loading popular movies...</LoadingMore>;
  }

  if (error) {
    return <div>Error loading popular movies. Please try again later.</div>;
  }

  return (
    <MovieFeedContainer ref={contentRef}> {/* Attach the ref to the container */}
      {movies.map((movie) => (
        <MovieCard key={movie.id}>
          {movie.backdrop_path && (
            <MovieImage
              src={`${imageBaseUrl}${movie.backdrop_path}`}
              alt={movie.title}
            />
          )}
          <MovieInfo>
            <MovieTitle>{movie.title}</MovieTitle>
            {/* You can add more movie details here */}
          </MovieInfo>
        </MovieCard>
      ))}
      {loading && page > 1 && <LoadingMore>Loading more movies...</LoadingMore>}
      {hasNextPage && (
        <LoadMoreTrigger ref={loadMoreRef}>
          {/* This empty div triggers the Intersection Observer */}
        </LoadMoreTrigger>
      )}
      {!hasNextPage && movies.length > 0 && <NoMoreMovies>No more popular movies.</NoMoreMovies>}
    </MovieFeedContainer>
  );
}

const MovieFeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: ${props => props.theme.bg};
  overflow-y: auto; /* Make the container scrollable */
`;

const MovieCard = styled.div`
  background-color: ${props => props.theme.cardColor};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
  width: 80%;
  max-width: 700px;

  @media (max-width: 768px) {
    width: 95%;
  }
`;

const MovieImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const MovieInfo = styled.div`
  padding: 15px;
`;

const MovieTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.5rem;
  color: ${props => props.theme.text};
`;

const LoadingMore = styled.div`
  padding: 20px;
  color: #777;
`;

const NoMoreMovies = styled.div`
  padding: 20px;
  color: #777;
`;

const LoadMoreTrigger = styled.div`
  height: 20px;
  visibility: hidden;
`;


const pulse = keyframes`
	0% {
		background-position: 0% 0%;
	}

	100% {
		background-position: -135% 0%;
	}
`;

const SkeletonPulse = styled.div`
  display: block;
  height: 100%;
  width: 100%;
  background: linear-gradient(-90deg, #121212 0%, #161616 50%, #121212 100%);
  background-size: 400% 400%;
  animation: ${pulse} 1s linear;
`;

const SkeletonLine = styled(SkeletonPulse)`
  margin-bottom: ${(props) => (props.mb ? props.mb : "")};
  margin-top: ${(props) => (props.mt ? props.mt : "")};
  margin-left: ${(props) => (props.ml ? props.ml : "")};
  margin-right: ${(props) => (props.mr ? props.mr : "")};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-radius: 4px;

  &::before {
    content: "\\00a0";
  }
`;

const VideoCardSkeleton = styled(SkeletonLine)`
  width: 100%;
  height: 180px;

  @media screen and (max-width: 600px) {
    height: 250px;
  }

  @media screen and (max-width: 420px) {
    height: 200px;
  }
`;

const SkeletonMovieCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
  width: 80%;
  max-width: 700px;

  @media (max-width: 768px) {
    width: 95%;
  }

  .skeleton-image {
    width: 100%;
    height: 200px;
    background-color: #ddd;
    border-radius: 8px 8px 0 0;
    animation: skeleton-loading 1.2s linear infinite;
  }

  .skeleton-title {
    height: 24px;
    width: 60%;
    background-color: #ddd;
    margin: 10px 15px;
    border-radius: 4px;
    animation: skeleton-loading 1.2s linear infinite;
  }

  @keyframes skeleton-loading {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
`;

export default PopularMoviesNewsFeed;
