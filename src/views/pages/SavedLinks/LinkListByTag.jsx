import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link, useParams, useHistory } from 'react-router-dom';
import { LITLOOP_API_URL } from 'core/constants/urls';

const LinkListByTag = () => {

  const { tagname } = useParams();
  const [query, setQuery] = useState(tagname || '');
  const [results, setResults] = useState([]);
  const history = useHistory();

  // Search whenever tagname changes
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${LITLOOP_API_URL}/links/search/`, {
          params: { q: tagname },
        });
        setResults(response.data.results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    if (tagname) {
      fetchResults();
    }
  }, [tagname]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${LITLOOP_API_URL}/links/search/`, {
        params: { q: query },
      });
      setResults(response.data.results);
      history.push(`/linktag/${query.trim()}`);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <Container>
      <Title>Search Links by Tag</Title>
      <SearchInput
        type="text"
        placeholder="Enter a hashtag..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button onClick={handleSearch}>Search</Button>

      <Results>
        {results.map((link, index) => (
          <LinkCard key={link.id}>
            <Number>{index + 1} </Number>
            <Metadata>
            <div>
              <strong>URL:</strong>{' '}
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.url}
              </a>
            </div>
            {/*<Hashtags>
              <strong>Hashtags:</strong> {link.hashtags.join(', ')}


            </Hashtags>*/}
            <Hashtags>
              {link.hashtags.map((tag, idx) => (
                <span><StyledLink to={`/linktag/${tag}`} key={idx} >{tag}</StyledLink></span>
              ))}
            </Hashtags>
            <div>
              <strong>User ID:</strong> {link.user_id ?? 'N/A'}
            </div>
            </Metadata>
          </LinkCard>
        ))}
      </Results>
    </Container>
  );
};


const Number = styled.span`
  font-weight: bold;
  margin-right: 8px;
  color: #0077cc;
`;

const Metadata = styled.div`
  display: block;
`;

const StyledLink = styled(Link)`
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 2rem;
  margin-top: 0;
  border-radius: 12px;
  background: #f9f9f9;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #0077cc;
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 12px;
  background: #686cb9;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #8186e2;
  }
`;

const Results = styled.div`
  margin-top: 2rem;
`;

const LinkCard = styled.div`
  display: flex;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const Hashtags = styled.div`
  margin-top: 0.5rem;
  span {
    background: #eee;
    border-radius: 4px;
    padding: 2px 6px;
    margin-right: 5px;
    font-size: 0.85rem;
  }
`;

export default LinkListByTag;
