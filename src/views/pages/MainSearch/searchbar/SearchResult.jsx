import "./SearchResult.css";
import styled from 'styled-components';
import { Link } from "react-router-dom";

import useHistoryPush from "core/hooks/useHistoryPush";

const StyledSpan = styled.span`
  cursor: default;
`;
const LinkStyled = styled(Link)`
  cursor: default;
  align-items: center;
  color: ${props => props.theme.text};
  text-decoration: none;
  &:hover: {
    text-decoration: underline;
  }

  /* display: grid; */

  /* grid-gap: 1em; */
   /* grid-template-columns: 20px 29px minmax(81px,0fr); */
  display: flex;

  span {
    font-family: Helvetica;
  }
`;

export const SearchResult = ({ result }) => {
  const historyPush = useHistoryPush();

  const handleSearch = () => {
    // Assuming '/search' is the route for the search results page
    // Reference: https://stackoverflow.com/questions/10857590/javascript-encodeuricomponent-and-converting-spaces-to-symbols
    historyPush(`/search/movie?query=${encodeURIComponent(result).replace(/%20/g, "+")}`);
  };

  return (
    <div
      className="search-result"
      // onClick={(e) => alert(`You selected ${result}!`)}
      onClick={handleSearch}
    >
      <StyledSpan
        onClick={handleSearch}
        >{result}</StyledSpan>
    </div>
  );
};
