import React from "react";
import { useSelector } from "react-redux";
import { selectors } from "core/reducers/index";
import BaseImage from "views/components/BaseImage";
import BaseCard from "views/components/BaseCard";
import ListItemWithAvatarFromSpotify from "views/components/ListItemWithAvatarFromSpotify";
import { useConfiguration } from "./ConfigurationProvider";

function AlbumListItem({ albumId }) {
  const album = useSelector(state => selectors.selectAlbum(state, albumId));
  const { getImageUrlz } = useConfiguration();

  // function renderItemz(album) {
  //   if (!album.images.length) {
  //     return album;
  //   } else if (album.images.length >0){
  //     return (
  //       album.images[0].url
  //     );
  //   }
  // }

  function renderItemz(album) {
    if (!album.images[0].url ) {
      return album;
    } else if (album.images.length >0){
      return (
        album.images[0].url
      );
    }
  }
  function renderTitle(album) {
    if (!album.name ) {
      return album;
    } else if (album.name >0){
      return (
        album.name
      );
    }
  }

  // return (
  //   <ListItemWithAvatarFromSpotify
  //     avatarUrl={renderItemz}
  //     primaryText={renderTitle}
  //
  //     {...props}
  //   />
  // );
  // if (!album.images) {
  //   return null
  // }
  return (
    <ListItemWithAvatarFromSpotify
      avatarUrl={album.images[0] ? album.images[0].url : ""}
      primaryText={album.name}
      secondaryText={album.release_date}
      artistName={album.artists}
      // {...props}
    />
  );
}

export default AlbumListItem;
