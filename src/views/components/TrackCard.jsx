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
import MovieRatingTag from "./MovieRatingTag";
import { getAspectRatioString } from "./AspectRatio";
import { useConfiguration } from "./ConfigurationProvider";

import { selectors } from "core/reducers/index";

// const useStyles = makeStyles(theme => ({
//   link: {
//     textDecoration: "none"
//   }
// }));

function TrackCard({ trackId, subheader }) {
  // const classes = useStyles();
  const track = useSelector(state => selectors.selectTrack(state, trackId));
  const { getImageUrl } = useConfiguration();

  return (
    <ModalLink to={`/track/${trackId}`}>

      {/*<RouterLink className={classes.link} to={`/movie/${movieId}`}>*/}

        <BaseCard hasActionArea>
          <BaseImage
            src={track.album.images[0] ? track.album.images[0].url : ""}
            alt={track.name}
            aspectRatio={getAspectRatioString(2, 3)}
          />
          {/*<div style={{ position: "absolute", top: 0, left: 0 }}>
            <MovieRatingTag movieId={movieId} />
          </div>*/}
          <BaseCardHeader title={track.name} subheader={subheader} />
          <BaseCardHeader  subheader={subheader} />
        </BaseCard>
      {/*</RouterLink>*/}
    </ModalLink>
  );
}

export default TrackCard;
