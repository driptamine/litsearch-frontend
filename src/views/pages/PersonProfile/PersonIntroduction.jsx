import React from "react";
import { useSelector } from "react-redux";


// MATERIAL DONE
// import { Typography, Box, Grid, Link, makeStyles } from "@mui/material";
import { StyledTypography, StyledBox, StyledGrid, StyledLink } from 'views/styledComponents';

import Introduction from "views/components/Introduction";
import ImdbLogo from "views/components/ImdbLogo";

import { selectors } from "core/reducers/index";
import { getImdbProfileUrl } from "core/utils";

// const useStyles = makeStyles(theme => ({
//   biography: {
//     whiteSpace: "pre-wrap"
//   }
// }));

function PersonIntroduction({ personId }) {
  const person = useSelector(state => selectors.selectPerson(state, personId));
  // const classes = useStyles();

  if (!person) {
    return null;
  }

  return (
    <Introduction
      imageSrc={person.profile_path}
      backgroundImageSrc={person.profile_path}
      title={person.name}
      content={
        <>
          <StyledGrid container spacing={2}>
            <StyledGrid item xs={12}>
              <StyledBox display="flex" alignItems="center">
                <StyledLink
                  href={getImdbProfileUrl(person.imdb_id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ImdbLogo />
                </StyledLink>
              </StyledBox>
            </StyledGrid>
            <StyledGrid item xs={12}>
              <StyledTypography variant="h6" gutterBottom>
                Biography
              </StyledTypography>
              <StyledTypography
                // className={classes.biography}
                variant="body2"
              >
                {person.biography}
              </StyledTypography>
            </StyledGrid>
          </StyledGrid>
        </>
      }
    />
  );
}

export default PersonIntroduction;
