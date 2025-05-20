import React from "react";
import styled from "styled-components";
// MATERIAL UNDONE
// import {
//   ListItem,
//   ListItemAvatar,
//   Avatar,
//   ListItemText,
//   makeStyles
// } from "@mui/material";
import {
  StyledListItem,
  StyledListItemAvatar,
  StyledAvatar,
  StyledListItemText,
} from 'views/styledComponents'
import { useConfiguration } from "./ConfigurationProvider";

// const useStyles = makeStyles(theme => ({
//   secondaryText: {
//     wordBreak: "break-word"
//   }
// }));

function ListItemWithAvatar({
  avatarUrl,
  primaryText,
  secondaryText,
  ...rest
}) {
  // const classes = useStyles();
  const { getImageUrl } = useConfiguration();

  return (
    <StyledListItem
      hover
      // flex="true"
      alignItems="flex-start"
      dense {...rest}
      >

      <StyledListItemAvatar>
        <StyledAvatar src={getImageUrl(avatarUrl)} alt={"Avatar"} variant={"circular"}/>
      </StyledListItemAvatar>
      
      <StyledListItemText
        classes={{
          // secondary: classes.secondaryText
        }}
        primary={primaryText}
        secondary={secondaryText}
      >
        {primaryText}
      </StyledListItemText>
    </StyledListItem>
  );
}

export default ListItemWithAvatar;
