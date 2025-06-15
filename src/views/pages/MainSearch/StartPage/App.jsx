import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash/debounce';

import styled from 'styled-components';

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
  const [results, setResults] = useState([]);

  // return (
  //   <div className="App">
  //     <div className="search-bar-container">
  //       <StyledSearchBar setResults={setResults} />
  //       {results && results.length > 0 && <StyledSearchResultsList results={results} />}
  //     </div>
  //   </div>
  // );


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

  // const inputRef = useRef(null);

  const getCursorPosition = () => {
    if (ref.current) {
      // alert(ref.current.selectionStart)
      return ref.current.selectionStart;

    }
    return -1; // Handle the case where the input is not yet focused
  };

  useEffect(() => {

    // const textarea = document.getElementById("textarea");
    // const cursorPos = textarea.selectionStart;
    // alert(cursorPos);

    dispatch(fetchQuerySearch(searchValue, cursorPosition));
  }, [dispatch, searchValue]);

  function handleInputValueChange(inputValue) {
    setSearchValue(inputValue);
    // setTimeOut
  }

  // useEffect(() => {
  //   // Focus the input element
  //   ref.current.focus();
  // }, []);


  const handleCursorPosition = (event) => {
    const position = event.target.selectionStart;
    setCursorPosition(position);
    // dispatch(fetchQuerySearch(searchValue, position));
  };

  return (
    <SearchContainer
      // style={{ display: 'flex', justifyContent: 'center', marginTop: '300px' }}
      // style={}
    >
      <Header>
        {/*<Toggle theme={theme} toggleTheme={themeToggler} />*/}
      </Header>
      <LitLoopLogo src={ litloopLogo } />
      {/*<LitLoopLogo src={ props.theme === 'light'  ? litNightLogo : litLightLogo } />*/}


      {/*<LogoStyled>LitLook</LogoStyled>*/}
      {/*<div>Cursor Position: {cursorPosition}</div>*/}
      <Autocomplete
        suggestions={suggestionz}
        recommendations={months}
        output={(e) => {
          setValue(e)
          // setTimeOut(()=>{
          //   setValue(e)
          // }, 2000)
        }}
        // output={debounce((e) => setValue(e), 5000)}

        clearIcon={true}

        renderInput={(params, ref) => (
          <InputStyled
            {...params}
            id="textarea-input"
            autoFocus
            ref={ref}


            placeholder={'Search '}
            type='text'
            // value={value}
            value={searchValue || ''}

            // onClick={handleCursorPosition}
            // onKeyUp={handleCursorPosition}
            onSelect={handleCursorPosition} // reference: https://chatgpt.com/c/0adb1d75-24f5-4791-96fb-744f4941c378

            // cursorPoz={params.cursorPozz}
          />
        )}
        onInputValueChange={handleInputValueChange}
        // onInputValueChange={}
      />
      <PreFooterStyled/>
    </SearchContainer>
  )
}


const SearchContainer = styled.div`
  // padding-top: 38vh;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
  height: 100%;
`;
const Header = styled.div`
  height: 40px;
  /* height: 0px; */
`;
const LogoStyled = styled.div`
  font-family: Helvetica-Bold;
  font-size: xxx-large;
  height: 150px;
  /* height: 50px; */
  display: flex;
  align-items: center;
`;
const PreFooterStyled = styled.div`
  height: 200px;
`;
const InputStyled = styled.input`
  color: ${(props) => props.theme.inputTextColor};
  width: 550px;
  @media screen and (max-width: 1200px) {
    width: 550px;
  }
  @media screen and (max-width: 800px) {
    width: 550px;
  }
  @media screen and (max-width: 600px) {
    width: 300px;
  }
  @media screen and (max-width: 450px) {
    width: 300px;

  }
  border-radius: 10px;
  height: 40px;
  padding-left: 10px;
  border: 1px solid #7c7c7c;
  /* background: #ffffff; */
  background-color: ${(props) => props.theme.inputBg};
  margin-left: 0px;
`;

const LitLoopLogo = styled.img`
  /* width: 48px; */
  display: block;

  /* width: 30px; */
  /* height: 20px; */
  height: 50px;
  margin-top: auto;
  margin-bottom: auto;
  padding-bottom: 40px;

  /* margin-left: auto; */
  /* margin-right: auto; */

`;

export default SearchApp;
