import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

// MATERIAL DONE
// import { makeStyles } from "@mui/material/styles";

import BaseImage from "views/components/BaseImage";
import BaseCard from "views/components/BaseCard";
import RouterLink from "views/components/RouterLink";
import ModalLink from "views/components/ModalLink";

import BaseCardHeader from "views/components/BaseCardHeader";

import { getAspectRatioString } from "./AspectRatio";
import { useConfiguration } from "./ConfigurationProvider";

import { selectors } from "core/reducers/index";

// const useStyles = makeStyles(theme => ({
//   link: {
//     textDecoration: "none"
//   }
// }));

// const StyledRouterLink = styled(ModalLink)`
const StyledRouterLink = styled(RouterLink)`
  text-decoration: none;
`;

function PersonCard({ personId }) {
  // const classes = useStyles();
  const person = useSelector(state => selectors.selectPerson(state, personId));
  const { getImageUrl } = useConfiguration();

  return (
    <ModalLink to={`/person/${personId}`}>
    {/*<StyledRouterLink to={`/person/${personId}`}>*/}
      <BaseCard hasActionArea>
        <BaseImage
          src={getImageUrl(person.profile_path)}
          alt={person.name}
          aspectRatio={getAspectRatioString(2, 3)}
        />
        <BaseCardHeader title={person.name} />
      </BaseCard>
    {/*</StyledRouterLink>*/}
    </ModalLink>
  );
}

export default PersonCard;
