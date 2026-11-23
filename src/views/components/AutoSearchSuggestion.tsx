import React from 'react';
import { styled } from '@linaria/react';

// import MenuItem from '@mui/material/MenuItem';
// import { makeStyles } from '@mui/material';

const styledMenuItemStyles = props => `
  font-weight: ${props.isSelected ? 600 : 400};
`;

const StyledMenuItem = styled.div`
  background-color: var(--autoCompleteBackgroundColor);
  ${styledMenuItemStyles}
  padding: 0;
  font-color: var(--text);
`;

// const useStyles = makeStyles(theme => ({
//   menuItem: {
//     fontWeight: ({ isSelected }) => (isSelected ? 600 : 400),
//     padding: 0
//   }
// }));

function AutoSearchSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
  renderSuggestion
}) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = selectedItem ? selectedItem === suggestion.title : false;
  // const classes = useStyles({ isSelected });

  return (
    <StyledMenuItem

      {...itemProps}
      selected={isHighlighted}
      // component="div"
      dense
      // className={classes.menuItem}
    >
      {renderSuggestion(suggestion)}

    </StyledMenuItem>
  );
}

export default AutoSearchSuggestion;
