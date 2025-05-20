import React from "react";
import { useSelector } from "react-redux";
import { selectors } from "core/reducers/index";
import BaseImage from "views/components/BaseImage";
import BaseCard from "views/components/BaseCard";
import ListItemWithAvatarFromSpotify from "views/components/ListItemWithAvatarFromSpotify";
import { useConfiguration } from "./ConfigurationProvider";

function ArtistListItem({ artistId, ...props }) {
  const artist = useSelector(state => selectors.selectArtist(state, artistId));
  const { getImageUrlz } = useConfiguration();

  function renderItemz(artist) {
    if (!artist.images.length) {
      return artist;
    } else if (artist.images.length >0){
      return (
        artist.images[0].url
      );
    }
  }

  // function renderItemz(artist) {
  //   if (!artist.images[0]url ) {
  //     return artist;
  //   } else if (artist.images.length >0){
  //     return (
  //       artist.images[0].url
  //     );
  //   }
  // }

  // return (
  //   <ListItemWithAvatarFromSpotify
  //     avatarUrl={renderItemz}
  //     primaryText={artist.name}
  //
  //     {...props}
  //   />
  // );
  // if (!artist.images) {
  //   return null
  // }

  return (
    <ListItemWithAvatarFromSpotify
      avatarUrl={artist.images[0] ? artist.images[0].url : ""}
      primaryText={artist.name}

      {...props}
    />
  );
}

export default ArtistListItem;
