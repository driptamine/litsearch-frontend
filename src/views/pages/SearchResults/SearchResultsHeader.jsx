import React from 'react';

// MATERIAL DONE
// import { Typography, Box } from '@mui/material';
import { StyledTypography, StyledBox } from 'views/styledComponents';

function SearchResultsHeader({ query, totalResults }) {
  return (
    <StyledBox
      display="grid"
      alignItems="center"
      justifyContent="space-between"
      style={{marginBottom: '20px'}}
      // flexWrap="wrap"
    >
      {/*<StyledTypography variant="h6">Search Results For: {query} </StyledTypography>*/}

      {/*<StyledTypography color="textSecondary">
        Total {totalResults} Results
      </StyledTypography>*/}
    </StyledBox>
  );
}

export default SearchResultsHeader;
