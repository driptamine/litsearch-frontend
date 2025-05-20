import React from "react";
import { useSelector } from "react-redux";


// MATERIAL DONE
// import { Typography, Box, Grid, Link, makeStyles } from "@mui/material";
import { StyledTypography, StyledBox, StyledGrid, StyledLink } from 'views/styledComponents';

import BaseImageV2 from "views/components/BaseImageV2";
import BaseCard from "views/components/BaseCard";

// import Rating from "./Rating";
import Introduction from "views/components/Introduction";
import ImdbLogo from "views/components/ImdbLogo";
// import PersonGenreChip from "./PersonGenreChip";

import { selectors } from "core/reducers/index";
import {  getImdbProfileUrl } from "core/utils";
import { getAspectRatioString } from "views/components/AspectRatio";
import { useConfiguration } from "views/components/ConfigurationProvider";


function PersonIntroductionV2({ personId }) {
  const person = useSelector(state => selectors.selectPerson(state, personId));
  // const classes = useStyles();
  const { getImageUrl } = useConfiguration();
  // const releaseYear = getPersonReleaseYear(person);

  if (!person) {
    return null;
  }

  // const linkList = album.artists.map((artist) => {
  //   return (
  //     // <li key={artist.id}>
  //       <Link
  //         // key={.id}
  //         to={`/person/${artist.artist_uri}/`}
  //         style={{
  //           fontWeight: "bold",
  //           color: '#FFF',
  //           textDecoration: 'none',
  //           "&:hover": {
  //             textDecoration: "underline"
  //           }
  //         }}
  //         >
  //         {artist.name}, {'       '}
  //       </Link>
  //     // </li>
  //   );
  // });

  return (
    <div>
      <StyledTypography color="#00a0b0">{person.name}</StyledTypography>
      {/*<img src={person.poster_path} />*/}
      {/*<StyledBox display="flex">*/}
        <BaseImageV2
          src={getImageUrl(person.profile_path)}
          aspectRatio={getAspectRatioString(2, 3)}
          width={20}
        />
        {/*<a target="_blank" href={`https://rezka.ag/search/?q=${person.title}&do=search&subaction=search`}>rezka</a>*/}
      {/*</StyledBox>*/}
      <StyledBox display="flex" alignItems="center">

        <StyledBox marginLeft={2} display="flex">
          <StyledLink
            href={`https://www.imdb.com/name/${person.imdb_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ImdbLogo />
          </StyledLink>


          {/*<a
            target="_blank"
            href={`https://rezka.ag/search/?q=${person.name}&do=search&subaction=search`}>
            rezka
          </a>*/}
        </StyledBox>
      </StyledBox>
    </div>

  );
}

export default PersonIntroductionV2;
