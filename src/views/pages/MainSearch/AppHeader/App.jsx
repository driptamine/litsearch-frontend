import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import styled from 'styled-components';
import { fetchQuerySearch } from 'core/actions';
import { selectors } from 'core/reducers/index';

// import "./App.css";
import Autocomplete from 'views/pages/MainSearch/AppHeader/Autocomplete'



const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ]

function SearchApp() {
  const dispatch = useDispatch();
  const [results, setResults] = useState([]);

  const [value, setValue] = useState('')
  const [searchValue, setSearchValue] = useState("");

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
    dispatch(fetchQuerySearch(searchValue));
  }, [dispatch, searchValue]);

  function handleInputValueChange(inputValue) {
    setSearchValue(inputValue);
  }


  const [query, setQuery] = useState(() => {
    const q = new URLSearchParams(window.location.search);
    // console.log(q.toString());
    return q.get("query") || "";
  });

  return (
    <SearchContainer
      // style={{ display: 'flex', justifyContent: 'center', marginTop: '300px' }}
      // style={}
    >
      <Header />
      <LogoStyled>LitLook</LogoStyled>
      <Autocomplete
        suggestions={suggestionz}
        output={(e) => setValue(e)}
        // suggestions={months}
        
        clearIcon={true}
        renderInput={(params, ref) => (
          <InputStyled
            {...params}
            ref={ref}

            placeholder={'Search '}
            type='text'
            // value={value}

            // value={query || ''}

            // onChange={(e) => {
            //     setQuery(e.target.value);
            //     handleChange(e.target.value);
            // }}
            // value={searchValue || ''}

          />
        )}

        onInputValueChange={handleInputValueChange}
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
const InputStyled = styled.input`

  width: 550px;
  border-radius: 10px;
  height: 40px;
  padding-left: 10px;
  border: 1px solid #7c7c7c;
  background: #ffffff;
  margin-left: 0px;
`;
const LogoStyled = styled.div`
  font-family: Helvetica-Bold;
  font-size: xxx-large;
  height: 200px;
  display: flex;
  align-items: center;
`;
const PreFooterStyled = styled.div`
  height: 200px;
`;
const Header = styled.div`
  height: 150px;
`;


export default SearchApp;
