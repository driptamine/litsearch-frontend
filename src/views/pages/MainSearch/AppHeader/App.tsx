import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@linaria/react';
import { fetchQuerySearch } from 'core/actions';
import { selectors } from 'core/reducers/index';

import Autocomplete from 'views/pages/MainSearch/AppHeader/Autocomplete'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',]

interface SuggestionItem {
  id: string | number;
  query?: string;
  title?: string;
  suggestionType?: string;
  [key: string]: unknown;
}

function SearchApp() {
  const dispatch = useDispatch();
  const [results, setResults] = useState<SuggestionItem[]>([]);

  const [value, setValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const movieIds = useSelector((state: any) => selectors.selectMovieSearchResultIds(state, searchValue)) || [];
  const albumIds = useSelector((state: any) => selectors.selectAlbumSearchResultIds(state, searchValue)) || [];
  const queryIds = useSelector((state: any) => selectors.selectQuerySearchResultIds(state, searchValue)) || [];
  const movies = useSelector((state: any) => selectors.selectMovies(state, movieIds));
  const albums = useSelector((state: any) => selectors.selectAlbums(state, albumIds));
  const queries = useSelector((state: any) => selectors.selectQueries(state, queryIds));

  let suggestionz: SuggestionItem[] = [
    ...(movies || []).slice(0, 3).map((movie: any) => ({ ...movie, suggestionType: 'movie' })),
    ...(albums || []).slice(0, 3).map((album: any) => ({ ...album, suggestionType: 'album' })),
    ...(queries || []).slice(0, 20).map((query: any) => ({ ...query, suggestionType: 'query' })),
  ];

  useEffect(() => {
    dispatch(fetchQuerySearch(searchValue));
  }, [dispatch, searchValue]);

  function handleInputValueChange(inputValue: string) {
    setSearchValue(inputValue);
  }

  const [query, setQuery] = useState<string>(() => {
    const q = new URLSearchParams(window.location.search);
    return q.get('query') || '';
  });

  return (
    <SearchContainer>
      <Header />
      <LogoStyled>LitLook</LogoStyled>
      <Autocomplete
        suggestions={suggestionz}
        output={(e: string) => setValue(e)}
        clearIcon={true}
        renderInput={(params: any, ref: any) => (
          <InputStyled
            {...params}
            ref={ref}
            placeholder={'Search '}
            type='text'
          />
        )}
        onInputValueChange={handleInputValueChange}
      />
      <PreFooterStyled/>
    </SearchContainer>
  )
}

const SearchContainer = styled.div`
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