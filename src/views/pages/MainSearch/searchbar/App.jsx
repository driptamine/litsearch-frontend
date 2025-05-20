import { useState } from "react";
import styled from "styled-components";

import "./App.css";
import { SearchBar } from "./SearchBar";
import { SearchResultsList } from "./SearchResultsList";


function SearchApp() {
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  return (
    <div className="App">
      <div className="search-bar-container">
        <StyledSearchBar setResults={setResults} />
        {results && results.length > 0 && <StyledSearchResultsList results={results} />}
      </div>
    </div>
  );
}

const StyledSearchBar = styled(SearchBar)`
  .input-wrapper {
    width: 100%;
    height: 2.5rem;
    border: none;
    border-radius: 10px;
    padding: 0 15px;
    box-shadow: 0px 0px 8px #ddd;
    background-color: white;
    display: flex;
    align-items: center;
  }

  input {
    background-color: transparent;
    border: none;
    height: 100%;
    font-size: 1.25rem;
    width: 100%;
    /* margin-left: 5px; */
  }

  input:focus {
    outline: none;
  }

  #search-icon {
    color: royalblue;
  }

`;
const StyledSearchResultsList = styled(SearchResultsList)`

`;
export default SearchApp;
