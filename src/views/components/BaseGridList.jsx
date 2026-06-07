import React from 'react';
import LoadingIndicator from 'views/components/LoadingIndicator';
import { styled } from '@linaria/react';


import { StyledTypography } from 'views/styledComponents';

const DEFAULT_ITEMS = [];

function defaultKeyExtractor(id) {
  return id;
}


const StyledFlexList = styled.div`
  list-style: none;
  padding: 0;
  display: grid;
  grid-gap: var(--spacing);
  grid-template-columns: ${({ minItemWidth }) => `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`};
`;

function BaseGridList({
  items = DEFAULT_ITEMS,
  loading,
  renderItem,
  spacing = 1,
  minItemWidth = 160,
  keyExtractor = defaultKeyExtractor,
  listEmptyMessage = "Nothing has been found"
}) {
  // const classes = useStyles({ minItemWidth, spacing });

  function extractItemKey(item, index) {
    return typeof keyExtractor === "string"
      ? item[keyExtractor]
      : keyExtractor(item, index);
  }

  if (!items.length && !loading) {
    if (typeof listEmptyMessage === "string") {
      return <StyledTypography>{listEmptyMessage}</StyledTypography>;
    }

    return listEmptyMessage;
  }

  return (
    <React.Fragment>
      <StyledFlexList
        minItemWidth={minItemWidth}
      >
        {items.map((item, index) => (
          <React.Fragment key={extractItemKey(item, index)}>
            {renderItem(item, index)}
          </React.Fragment>
        ))}
      </StyledFlexList>

      <LoadingIndicator loading={loading} />
    </React.Fragment>
  );
}

export default BaseGridList;
