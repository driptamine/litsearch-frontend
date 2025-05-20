import React from "react";
import { useSelector } from "react-redux";

// MATERIAL DONE
// import { Typography } from "@mui/material";
import { StyledTypography } from 'views/styledComponents';

import TextWithLabel from "views/components/TextWithLabel";

import { selectors } from "core/reducers/index";

function ArtistInfo({ artistId }) {
  const artist = useSelector(state => selectors.selectArtist(state, artistId));

  function getGender() {
    return artist.gender === 1 ? "Female" : artist.gender === 2 ? "Male" : "";
  }

  if (!artist) {
    return null;
  }

  return (
    <>
      <TextWithLabel label="Known For" text={artist.known_for_department} />
      <TextWithLabel label="Gender" text={getGender(artist.gender)} />
      <TextWithLabel label="Birthday" text={artist.birthday} />
      <TextWithLabel label="Place of Birth" text={artist.place_of_birth} />
      {artist.official_site && (
        <TextWithLabel label="Official Site" text={artist.official_site} />
      )}
      {artist.also_known_as?.length ? (
        <TextWithLabel
          label="Also Known As"
          text={artist.also_known_as.map(alias => (
            <StyledTypography key={alias}>{alias}</StyledTypography>
          ))}
        />
      ) : null}
    </>
  );
}

export default ArtistInfo;
