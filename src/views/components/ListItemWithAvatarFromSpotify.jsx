import React from "react";

import {
  StyledListItem,
  StyledListItemAvatar,
  StyledAvatar,
  StyledListItemText,
} from 'views/styledComponents';
import { useConfiguration } from "./ConfigurationProvider";



function ListItemWithAvatarFromSpotify({
  avatarUrl,
  primaryText,
  secondaryText,
  artistName,
  ...rest
}) {

  const { getImageUrlz } = useConfiguration();

  function renderItem(avatarUrl) {
    if (avatarUrl.images.length === 0) {
      return getImageUrlz(avatarUrl);
    } else {
      return (
        avatarUrl
      );
    }
  }

  function renderArtistNames(artistNames) {  
    return artistNames.map((item, index) => {
      return item.name
    })
  }



  return (
    <StyledListItem hover alignItems="flex-start" dense {...rest}>
      <StyledListItemAvatar>
        <StyledAvatar src={avatarUrl}  variant={"circular"} />
      </StyledListItemAvatar>


      <StyledListItemText>


        {primaryText} <br></br>



        {artistName && renderArtistNames(artistName)} <br></br>
        {/*{secondaryText}*/}
      </StyledListItemText>
    </StyledListItem>
  );


}

export default ListItemWithAvatarFromSpotify;
