import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash/debounce';

import { styled } from '@linaria/react';
import { themeVars } from 'views/styles/theme-vars';

import litNightLogo from 'views/assets/viewsLogos/purple-views-logo.png';
import litloopLogo from 'views/assets/viewsLogos/purple-views-logo.png';
import litLightLogo from 'views/assets/viewsLogos/purple-views-logo.png';

import { fetchQuerySearch } from 'core/actions';
import { selectors } from 'core/reducers/index';
// import "./App.css";
import Autocomplete from './Autocomplete';

const months = [
  'Palace',
  'Apple',
  'Supreme',
  'Spotify',
  'Chrome Hearts',
  'Kanye West',
  'Nike',
  'Grailed',
  'Vans',
  'Independent',
  'Adidas',
  'StockX',
  'Bape',
  'Reddit',
  'Off-White',
  'Comme des Garçons',
  'Palm Angels',
  'Maison Margiela',
  'tommy hilfiger',


  'List of Recommended Search Queries'
]

function SearchApp() {
  const dispatch = useDispatch();
  const [value, setValue] = useState('')
  const [searchValue, setSearchValue] = useState("");
  const [cursorPosition, setCursorPosition] = useState('');

  const movieIds = useSelector(state => selectors.selectMovieSearchResultIds(state, searchValue)) || [];
  const albumIds = useSelector(state => selectors.selectAlbumSearchResultIds(state, searchValue)) || [];
  const queryIds = useSelector(state => selectors.selectQuerySearchResultIds(state, searchValue)) || [];
  const movies = useSelector(state => selectors.selectMovies(state, movieIds));
  const albums = useSelector(state => selectors.selectAlbums(state, albumIds));
  const queries = useSelector(state => selectors.selectQueries(state, queryIds));

  let suggestionz = [
    ...movies.slice(0, 3).map(movie => ({ ...movie, suggestionType: "movie" })),
    ...albums.slice(0, 3).map(album => ({ ...album, suggestionType: "album" })),
    ...queries.slice(0, 20).map(query => ({ ...query, suggestionType: "query" })),
  ];

  useEffect(() => {
    if (searchValue) {
      dispatch(fetchQuerySearch(searchValue, cursorPosition));
    }
  }, [dispatch, searchValue, cursorPosition]);

  function handleInputValueChange(inputValue) {
    setSearchValue(inputValue);
  }

  const handleCursorPosition = (event) => {
    const position = event.target.selectionStart;
    setCursorPosition(position);
  };

  return (
    <SearchContainer>
      <LogoSection>
        <LitLoopLogo src={litloopLogo} alt="LitLoop Logo" />
      </LogoSection>
      
      <SearchSection>
        <Autocomplete
          suggestions={suggestionz}
          recommendations={months}
          output={(e) => {
            setValue(e)
          }}
          clearIcon={true}
          renderInput={(params, ref) => (
            <InputWrapper>
              <SearchIcon>
                <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
              </SearchIcon>
              <InputStyled
                {...params}
                id="textarea-input"
                autoFocus
                autoComplete="off"
                ref={ref}
                placeholder='Search LitLoop'
                type='text'
                value={searchValue || ''}
                onSelect={handleCursorPosition}
              />
            </InputWrapper>
          )}
          onInputValueChange={handleInputValueChange}
        />
      </SearchSection>
      
      <ButtonsSection>
        <SearchButton>Lit Search</SearchButton>
        <SearchButton>I'm Feeling Lit</SearchButton>
      </ButtonsSection>
    </SearchContainer>
  )
}


const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  background-color: ${themeVars.body};
  padding-bottom: 10vh; /* Push slightly up from center */
  transition: background-color 0.3s ease;
`;

const LogoSection = styled.div`
  margin-bottom: 25px;
`;

const LitLoopLogo = styled.img`
  height: 92px;
  max-width: 100%;
  object-fit: contain;
`;

const SearchSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 20px;
  box-sizing: border-box;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 584px;
  height: 44px;
  background: ${themeVars.inputBg};
  border: 1px solid ${themeVars.inputBorderColor};
  box-shadow: none;
  border-radius: 24px;
  padding: 0 15px;
  transition: box-shadow 0.2s, background-color 0.3s ease;

  &:hover, &:focus-within {
    box-shadow: 0 1px 6px rgba(32,33,36,0.28);
    border-color: rgba(223,225,229,0);
  }
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  
  svg {
    fill: ${themeVars.text};
    opacity: 0.7;
    height: 20px;
    width: 20px;
  }
`;

const InputStyled = styled.input`
  flex: 1;
  background-color: transparent;
  border: none;
  margin: 0;
  padding: 0;
  color: ${themeVars.inputTextColor};
  word-wrap: break-word;
  outline: none;
  display: flex;
  font-size: 16px;
  height: 34px;
`;

const ButtonsSection = styled.div`
  margin-top: 25px;
  display: flex;
  gap: 12px;
`;

const SearchButton = styled.button`
  background-color: ${themeVars.cardColor};
  border: 1px solid ${themeVars.cardColor};
  border-radius: 4px;
  color: ${themeVars.text};
  font-family: Arial, sans-serif;
  font-size: 14px;
  margin: 11px 4px;
  padding: 0 16px;
  line-height: 27px;
  height: 36px;
  min-width: 54px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    box-shadow: 0 1px 1px rgba(0,0,0,0.1);
    background-color: ${themeVars.sideBarHoverColor};
    border: 1px solid #dadce0;
  }
`;

export default SearchApp;
