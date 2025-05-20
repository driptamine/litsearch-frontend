import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from 'styled-components';

// MATERIAL DONE
// import { Typography } from "@mui/material";
import { StyledTypography } from 'views/styledComponents';

import Profile from "views/components/Profile";
import ArtistInfo from "./ArtistInfo";
import ArtistIntroduction from "./ArtistIntroduction";
import ArtistIntroductionV2 from "./ArtistIntroductionV2";
// import ArtistImageGridList from "./ArtistImageGridList";
// import ArtistCastingGridList from "./ArtistCastingGridList";

import ArtistAlbums from "./ArtistAlbums";

import { selectors } from "core/reducers/index";
import { verifyCachedData } from "core/utils";
import { fetchArtist } from "core/actions";

const REQUIRED_FIELDS = ["biography", "imdb_id"];

const ReStyledTypography = styled(StyledTypography)`
  color: white;
`;
function ArtistProfile() {
  const dispatch = useDispatch();
  const { artistId } = useParams();
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingArtist(state, artistId)
  );
  const artist = useSelector(state => selectors.selectArtist(state, artistId));

  useEffect(() => {
    dispatch(fetchArtist(artistId, REQUIRED_FIELDS));
  }, [artistId, dispatch]);

  const loading = isFetching || !verifyCachedData(artist, REQUIRED_FIELDS);

  return (
    <Profile
      loading={loading}
      introduction={<ArtistIntroduction artistId={artistId} />}
      leftSide={
        <>
          <ReStyledTypography variant="h6" gutterBottom>
            Artist Info
          </ReStyledTypography>
          {/*<ArtistInfo artistId={artistId} />*/}
        </>
      }
      main={
        <>
          <ReStyledTypography variant="h6" gutterBottom>
            Images
          </ReStyledTypography>


          <ReStyledTypography variant="h6" gutterBottom>
            Albums
          </ReStyledTypography>
          <ArtistAlbums artistId={artistId}/>
        </>
      }
    />
  );
}

export default ArtistProfile;
