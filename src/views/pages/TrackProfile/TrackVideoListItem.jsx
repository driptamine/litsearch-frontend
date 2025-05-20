import React from "react";
import { useSelector } from "react-redux";
import { selectors } from "core/reducers/index";
import { ListItem, ListItemText } from "@mui/material";
import { useLocation } from "react-router-dom";
import RouterLink from "views/components/RouterLink";

function TrackVideoListItem({ videoId }) {
  const { pathname } = useLocation();
  const video = useSelector(state => selectors.selectVideo(state, videoId));

  return (
    <ListItem
      to={`${pathname}?watch=${video.key}`}
      keepScroll
      button
      component={RouterLink}
      dense
    >
      <ListItemText primary={video.name} secondary={video.type} />
    </ListItem>
  );
}

export default TrackVideoListItem;
