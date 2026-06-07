import React from 'react';

// MATERIAL DONE
// import { Typography, Box } from '@mui/material';
import { StyledTypography, StyledBox } from 'views/styledComponents';

function SearchResultsHeader({ query, totalResults }) {
  return (
    <StyledBox
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      style={{marginBottom: '10px', padding: '0 10px'}}
    >
      {/* Header content if needed */}
    </StyledBox>
  );
}

export default SearchResultsHeader;
