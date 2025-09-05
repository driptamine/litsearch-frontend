import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import { LITLOOP_API_URL } from 'core/constants/urls';

const LinksList = () => {
  const history = useHistory();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get('page')) || 1;

  const [links, setLinks] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Update page when URL changes
  useEffect(() => {
    const newPage = parseInt(new URLSearchParams(location.search).get('page')) || 1;
    setPage(newPage);
  }, [location.search]);

  // Update URL when page changes
  const handlePageChange = (newPage) => {
    history.push(`?page=${newPage}`);
  };

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get(
          `${LITLOOP_API_URL}/links/all/?page=${page}&page_size=${pageSize}`
        );
        setLinks(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching links:', error);
      }
    };

    fetchLinks();
  }, [page, pageSize]);

  return (
    <Container>
      <Link to={`/linktag/search`}>Search</Link>
      <h1>All Links</h1>
      {links.map((link) => (
        <LinkCard key={link.id}>
          <URL href={link.url} target="_blank" rel="noopener noreferrer">
            {link.url}
          </URL>
          <Hashtags>
            {link.hashtags.map((tag, idx) => (
              <span key={idx}>
                <StyledLink to={`/linktag/${tag}`} key={idx}>
                  {tag}
                </StyledLink>
              </span>
            ))}
          </Hashtags>
          <div>
            <br />
            <small>Created: {link.created_at}</small>
          </div>
        </LinkCard>
      ))}

      <Pagination>
        <PageButton
          onClick={() => handlePageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </PageButton>
        <PageInfo>
          Page {page} of {totalPages}
        </PageInfo>
        <PageButton
          onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </PageButton>
      </Pagination>
    </Container>
  );
};

// ... styled-components same as before ...



const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LinkCard = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const URL = styled.a`
  color: #0077cc;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ disabled }) => (disabled ? '#ccc' : '#0077cc')};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const PageInfo = styled.span`
  align-self: center;
`;

export default LinksList;
