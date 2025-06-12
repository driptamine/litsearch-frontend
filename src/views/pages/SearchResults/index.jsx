import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useLocation } from 'react-router-dom';

import styled from 'styled-components';
// MATERIAL UNDONE
// import { Tabs, Tab, Box } from '@mui/material';
import { StyledTabs, StyledTab, StyledBox } from 'views/styledComponents';

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
  fetchMovieSearch,
  fetchPersonSearch,
  fetchArtistSearch,
  fetchTrackSearch,
  fetchAlbumSearch } from 'core/actions';
import { DEFAULT_FIRST_PAGE } from 'core/reducers/higherOrderReducers/createPagination';
import { selectors } from 'core/reducers/index';
import useHistoryPush from 'core/hooks/useHistoryPush';
import useQueryString from 'core/hooks/useQueryString';

const ReStyledLink = styled(Link)`
  text-decoration: none;
  color: black;
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
  const totalImagesCount = useSelector(state =>
    selectors.selectImageSearchResultsTotalCount(state, query)
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
    // We are fetching movies and people to show total counts on tab labels.

    if (searchType === 'web') {
      dispatch(fetchWebsiteSearch(query, DEFAULT_FIRST_PAGE));
    }
    if (searchType === 'bing') {
      dispatch(fetchImageSearch(query, DEFAULT_FIRST_PAGE));
    }



    // dispatch(fetchImageSearch(query, DEFAULT_FIRST_PAGE));
    // dispatch(fetchQuerySearch(query));

    // dispatch(fetchMovieSearch(query, DEFAULT_FIRST_PAGE));
    // dispatch(fetchPersonSearch(query, DEFAULT_FIRST_PAGE));
    // dispatch(fetchArtistSearch(query, DEFAULT_FIRST_PAGE));
    // dispatch(fetchAlbumSearch(query, DEFAULT_FIRST_PAGE));
    // dispatch(fetchTrackSearch(query, DEFAULT_FIRST_PAGE));

  }, [dispatch, query]);

  const totalResults = {
    website: totalSerpCount,
    images: totalImagesCount,
    movie: totalMovieCount,
    person: totalPersonCount,
    artist: totalArtistCount,
    album: totalAlbumCount,
    track: totalTrackCount
  };

  return (
    <>
      <StyledTabs value={searchType} onChange={handleChange}>
        <StyledTab value="website" label={`Web (${totalSerpCount})`}>

          <ReStyledLink to={`web?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            All
          </ReStyledLink>
        </StyledTab>

        <StyledTab value="bing" label={`Images (${totalMovieCount})`}>

          <ReStyledLink to={`bing?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            <StyledSpan>
              <PicIcon />
            </StyledSpan>
            Images V1
          </ReStyledLink>
        </StyledTab>

        <StyledTab value="brave" label={`Images (${totalMovieCount})`}>

          <ReStyledLink to={`brave?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            <StyledSpan>
              <PicIcon />
            </StyledSpan>
            Images V2
          </ReStyledLink>
        </StyledTab>

        <StyledTab value="movie" label={`Movies (${totalMovieCount})`}>

          <ReStyledLink to={`movie?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            movie {totalMovieCount}
          </ReStyledLink>
        </StyledTab>

        <StyledTab value="person" label={`People (${totalPersonCount})`}>
          <ReStyledLink to={`person?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            person {totalPersonCount}
          </ReStyledLink>
        </StyledTab>

        <StyledTab value="artist" label={`Artist (${totalArtistCount})`}>
          <ReStyledLink to={`artist?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            artist {totalArtistCount}
          </ReStyledLink>
        </StyledTab>

        <StyledTab value="album" label={`Album (${totalAlbumCount})`}>
          <ReStyledLink to={`album?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            album {totalAlbumCount}
          </ReStyledLink>
        </StyledTab>

        <StyledTab value="track" label={`Track (${totalTrackCount})`}>
          <ReStyledLink to={`track?query=${encodeURIComponent(query).replace(/%20/g, "+")}`}>
            track {totalTrackCount}
          </ReStyledLink>
        </StyledTab>

      </StyledTabs>
      <StyledBox marginTop={2}>
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
      </StyledBox>
    </>
  );
}

const StyledSpan = styled.span`
  height: 13px;
  width: 13px;
  display: inline-block;
  margin-top: auto;
  margin-bottom: auto;
`;
export default SearchResults;
