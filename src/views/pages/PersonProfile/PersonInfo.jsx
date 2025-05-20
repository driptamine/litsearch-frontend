import React from "react";
import { useSelector } from "react-redux";


// MATERIAL DONE
// import { Typography } from "@mui/material";
import { StyledTypography } from 'views/styledComponents';

// VIEWS
import TextWithLabel from "views/components/TextWithLabel";

// CORE
import { selectors } from "core/reducers/index";

function PersonInfo({ personId }) {
  const person = useSelector(state => selectors.selectPerson(state, personId));

  function getGender() {
    return person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : "";
  }

  if (!person) {
    return null;
  }

  return (
    <>
      <TextWithLabel label="Known For" text={person.known_for_department} />
      <TextWithLabel label="Gender" text={getGender(person.gender)} />
      <TextWithLabel label="Birthday" text={person.birthday} />
      <TextWithLabel label="Place of Birth" text={person.place_of_birth} />
      {person.official_site && (
        <TextWithLabel label="Official Site" text={person.official_site} />
      )}
      {person.also_known_as?.length ? (
        <TextWithLabel
          label="Also Known As"
          text={person.also_known_as.map(alias => (
            <StyledTypography key={alias}>{alias}</StyledTypography>
          ))}
        />
      ) : null}
    </>
  );
}

export default PersonInfo;
