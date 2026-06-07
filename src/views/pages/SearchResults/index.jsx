import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useLocation } from 'react-router-dom';

import { styled } from '@linaria/react';
// MATERIAL UNDONE
// import { Tabs, Tab, Box } from '@mui/material';
import { StyledTabs, StyledBox } from 'views/styledComponents';

import SearchResultsHeader from './SearchResultsHeader';
import WebsiteSearchResults from './WebsiteSearchResults';
import ImageSearchResultsBing from './ImageSearchResultsBing';
import ImageSearchResultsBrave from './ImageSearchResultsBrave';
import MovieSearchResults from './MovieSearchResults';
import PersonSearchResults from './PersonSearchResults';
import ArtistSearchResults from './ArtistSearchResults';
import AlbumSearchResults from './AlbumSearchResults';
import TrackSearchResults from './TrackSearchResults';
import { PicIcon } from 'views/components/Sidebar/Icons';
import {
  fetchWebsiteSearch,

  fetchImageSearch,
  fetchBingImageSearch,
  fetchBraveImageSearch,

  fetchMovieSearch,
  fetchPersonSearch,
  fetchArtistSearch,
  fetchTrackSearch,
  fetchAlbumSearch } from 'core/actions';
import { DEFAULT_FIRST_PAGE } from 'core/reducers/higherOrderReducers/createPagination';
import { selectors } from 'core/reducers/index';
import useHistoryPush from 'core/hooks/useHistoryPush';
import useQueryString from 'core/hooks/useQueryString';

const reStyledLinkStyles = props => `
  color: ${props.theme?.textColor || 'black'};
`;

const ReStyledLink = styled(Link)`
  text-decoration: none;
  ${reStyledLinkStyles}
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 10px 15px;

  @media screen and (max-width: 600px) {
    padding: 8px 10px;
    font-size: 13px;
  }
`;

const styledTabStyles = props => props.active ? `
  border-bottom: 2px solid #676abb;
  font-weight: bold;
` : '';

const StyledTab = styled.div`
  margin-left: 10px;
  cursor: pointer;
  flex-shrink: 0;
  font-family: arial, sans-serif;
  font-size: 14px;
  border-bottom: 2px solid transparent;

  ${styledTabStyles}

  &:first-child {
    margin-left: 0;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  @media screen and (max-width: 600px) {
    margin-left: 5px;
  }
`;

function SearchResults() {
  const { query } = useQueryString();
  const { search, pathname } = useLocation();
  const { searchType } = useParams();
  const historyPush = useHistoryPush();
  const dispatch = useDispatch();

  const totalSerpCount = useSelector(state =>
    selectors.selectWebsiteSearchResultsTotalCount(state, query)
  );
  const totalBingImagesCount = useSelector(state =>
    selectors.selectImageSearchResultsTotalCount(state, query, 'bing')
  );
  const totalBraveImagesCount = useSelector(state =>
    selectors.selectImageSearchResultsTotalCount(state, query, 'brave')
  );

  const totalMovieCount = useSelector(state =>
    selectors.selectMovieSearchResultsTotalCount(state, query)
  );
  const totalPersonCount = useSelector(state =>
    selectors.selectPersonSearchResultsTotalCount(state, query)
  );
  const totalArtistCount = useSelector(state =>
    selectors.selectArtistSearchResultsTotalCount(state, query)
  );
  const totalAlbumCount = useSelector(state =>
    selectors.selectAlbumSearchResultsTotalCount(state, query)
  );

  const totalTrackCount = useSelector(state =>
    selectors.selectTrackSearchResultsTotalCount(state, query)
  );

  function handleChange(event, newValue) {
    historyPush(`/search/${newValue}${search}`);
  }

  useEffect(() => {
    if (searchType === 'web') {
      dispatch(fetchWebsiteSearch(query, DEFAULT_FIRST_PAGE));
    } else if (searchType === 'bing') {
      dispatch(fetchBingImageSearch(query, DEFAULT_FIRST_PAGE));
    } else if (searchType === 'brave') {
      dispatch(fetchBraveImageSearch(query, DEFAULT_FIRST_PAGE));
    } else if (searchType === 'movie') {
      dispatch(fetchMovieSearch(query, DEFAULT_FIRST_PAGE));
    } else if (searchType === 'person') {
      dispatch(fetchPersonSearch(query, DEFAULT_FIRST_PAGE));
    } else if (searchType === 'artist') {
      dispatch(fetchArtistSearch(query, DEFAULT_FIRST_PAGE));
    } else if (searchType === 'album') {
      dispatch(fetchAlbumSearch(query, DEFAULT_FIRST_PAGE));
    } else if (searchType === 'track') {
      dispatch(fetchTrackSearch(query, DEFAULT_FIRST_PAGE));
    }
  }, [dispatch, query, searchType]);

  const totalResults = {
    web: totalSerpCount,
    bing: totalBingImagesCount,
    brave: totalBraveImagesCount,
    movie: totalMovieCount,
    person: totalPersonCount,
    artist: totalArtistCount,
    album: totalAlbumCount,
    track: totalTrackCount
  };

  return (
    <MainWrapper>
      <StyledTabs>
        <StyledTab active={searchType === 'web'}>
          <ReStyledLink to={`web?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            All ({totalSerpCount})
          </ReStyledLink>
        </StyledTab>

        <StyledTab active={searchType === 'bing'}>
          <ReStyledLink to={`bing?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            <StyledSpan>
              <PicIcon />
            </StyledSpan>
            Images V1 ({totalBingImagesCount})
          </ReStyledLink>
        </StyledTab>

        <StyledTab active={searchType === 'brave'}>
          <ReStyledLink to={`brave?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            <StyledSpan>
              <PicIcon />
            </StyledSpan>
            Images V2 ({totalBraveImagesCount})
          </ReStyledLink>
        </StyledTab>

        <StyledTab active={searchType === 'movie'}>
          <ReStyledLink to={`movie?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            Movies ({totalMovieCount})
          </ReStyledLink>
        </StyledTab>

        <StyledTab active={searchType === 'person'}>
          <ReStyledLink to={`person?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            People ({totalPersonCount})
          </ReStyledLink>
        </StyledTab>

        <StyledTab active={searchType === 'artist'}>
          <ReStyledLink to={`artist?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            Artists ({totalArtistCount})
          </ReStyledLink>
        </StyledTab>

        <StyledTab active={searchType === 'album'}>
          <ReStyledLink to={`album?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            Albums ({totalAlbumCount})
          </ReStyledLink>
        </StyledTab>

        <StyledTab active={searchType === 'track'}>
          <ReStyledLink to={`track?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            Tracks ({totalTrackCount})
          </ReStyledLink>
        </StyledTab>

      </StyledTabs>

      {/*<StyledBox marginTop={2}>*/}
      <div marginTop={2}>
        <SearchResultsHeader
          query={query}
          totalResults={totalResults[searchType]}
        />
        {searchType === "web" && <WebsiteSearchResults query={query} searchType={searchType} />}

        {searchType === "bing" && <ImageSearchResultsBing query={query} searchType={searchType} />}
        {searchType === "brave" && <ImageSearchResultsBrave query={query} searchType={searchType} />}

        {searchType === "movie" && <MovieSearchResults query={query} searchType={searchType} />}
        {searchType === "person" && <PersonSearchResults query={query} searchType={searchType} />}
        {searchType === "artist" && <ArtistSearchResults query={query} searchType={searchType} />}
        {searchType === "album" && <AlbumSearchResults query={query} searchType={searchType} />}
        {searchType === "track" && <TrackSearchResults query={query} searchType={searchType} />}
      </div>
      {/*</StyledBox>*/}

    </MainWrapper>
  );
}

const MainWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;

  @media screen and (max-width: 600px) {
    padding: 10px;
  }
`;

const StyledSpan = styled.span`
  height: 13px;
  width: 13px;
  display: inline-block;
  margin-top: auto;
  margin-bottom: auto;
`;
export default SearchResults;
