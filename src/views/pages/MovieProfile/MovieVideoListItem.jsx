import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// MATERIAL DONE
// import { ListItem, ListItemText } from "@mui/material";
import { StyledListItem, StyledListItemText } from 'views/styledComponents';

import RouterLink from "views/components/RouterLink";

import { selectors } from "core/reducers/index";

function MovieVideoListItem({ videoId }) {
  const { pathname } = useLocation();
  const video = useSelector(state => selectors.selectVideo(state, videoId));

  return (
    <StyledListItem
      to={`${pathname}?watch=${video.key}`}
      keepScroll
      button
      component={RouterLink}
      dense
    >
      <StyledListItemText primary={video.name} secondary={video.type} />
    </StyledListItem>
  );
}

export default MovieVideoListItem;
