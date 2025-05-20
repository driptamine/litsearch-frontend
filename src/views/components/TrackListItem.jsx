import React from "react";
import { useSelector } from "react-redux";
import { selectors } from "core/reducers/index";
import ListItemWithAvatarFromSpotify from "views/components/ListItemWithAvatarFromSpotify";

function TrackListItem({ trackId, ...props }) {
  const track = useSelector(state => selectors.selectTrack(state, trackId));

  return (
    <ListItemWithAvatarFromSpotify
      avatarUrl={track.album.images[0] ? track.album.images[0].url : ""}
      primaryText={track.name}
      secondaryText={track.album.release_date}
      {...props}
    />
  );
}

export default TrackListItem;
