import React from "react";
import styled from 'styled-components';

// import MenuItem from "@mui/material/MenuItem";
// import { makeStyles } from "@mui/material";

const StyledMenuItem = styled.div`
  background-color: ${props => props.theme.autoCompleteBackgroundColor};
  font-weight: ${props => props.isSelected ? 600: 400 };
  padding: 0;
  font-color: ${props => props.theme.text};
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
