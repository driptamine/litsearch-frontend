import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useHistory } from 'react-router-dom';

// import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const history = useHistory();
  const [input, setInput] = useState("");

  // const headers = {
  //   '': '',
  //   '': ''
  // }
  const fetchData = (value) => {
    // fetch("http://localhost:8000/queries/search?q="+value)
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((query) => {
          return (
            value &&
            query &&
            query.name &&
            query.name.toLowerCase().includes(value)
          );
        });
        setResults(results);
      });


    // axios(endpoint, {
    //   method: 'GET',
    //   headers,
    // })
    // .then((response) => response.json())
    // .then((json) => {
    //   const results = json.filter((user) => {
    //     return (
    //       value &&
    //       user &&
    //       user.name &&
    //       user.name.toLowerCase().includes(value)
    //     );
    //   });
    //   setResults(results);
    // });
    //
    // .catch(failure);
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  const showSuggestions = () => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((query) => {
          return (
            value &&
            query &&
            query.name &&
            query.name.toLowerCase().includes(value)
          );
        });
        setResults(results);
      });
  };



  const [query, setQuery] = useState(() => {
    const q = new URLSearchParams(window.location.search);
    // console.log(q.toString());
    return q.get("query") || "";
  });

  const handleSearch = () => {
    // Assuming '/search' is the route for the search results page
    history.push(`/search/movie?query=${encodeURIComponent(input)}`);
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className="input-wrapper"
      >
      <FaSearch id="search-icon" />
      <input
        placeholder="Type to search..."
        value={query || ''}
        onChange={(e) => {
            setQuery(e.target.value);
            handleChange(e.target.value);
        }}
        // onChange={(e) => handleChange(e.target.value)}
        // onClick={showSuggestions}
        // onKeyPress={(e) => handleKeyDown(e)}
        // onSubmit={submitHandler}

        onKeyPress={handleKeyPress}
      />
    </div>
  );
};
