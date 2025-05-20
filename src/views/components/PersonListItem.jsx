import React from "react";
import { useSelector } from "react-redux";
import { selectors } from "core/reducers/index";
import ListItemWithAvatar from "views/components/ListItemWithAvatar";

function PersonListItem({ personId, secondaryText, ...props }) {
  const person = useSelector(state => selectors.selectPerson(state, personId));

  return (
    <ListItemWithAvatar
      avatarUrl={person.profile_path}
      primaryText={person.name}
      secondaryText={secondaryText}
      {...props}
    />
  );
}

export default PersonListItem;
