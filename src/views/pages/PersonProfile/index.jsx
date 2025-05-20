import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";


// MATERIAL DONE
// import { Typography } from "@mui/material";
import { StyledTypography } from 'views/styledComponents';

import Profile from "views/components/Profile";
import PersonInfo from "./PersonInfo";
import PersonIntroduction from "./PersonIntroduction";
import PersonIntroductionV2 from "./PersonIntroductionV2";
import PersonImageGridList from "./PersonImageGridList";
import PersonCastingGridList from "./PersonCastingGridList";

// CORE
import { fetchPerson } from "core/actions";
import { selectors } from "core/reducers/index";
import { verifyCachedData } from "core/utils";

const REQUIRED_FIELDS = ["biography", "imdb_id"];

function PersonProfile() {
  const dispatch = useDispatch();
  const { personId } = useParams();
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingPerson(state, personId)
  );
  const person = useSelector(state => selectors.selectPerson(state, personId));

  useEffect(() => {
    dispatch(fetchPerson(personId, REQUIRED_FIELDS));
  }, [personId, dispatch]);

  const loading = isFetching || !verifyCachedData(person, REQUIRED_FIELDS);

  return (
    <Profile
      loading={loading}
      introduction={<PersonIntroductionV2 personId={personId} />}
      // leftSide={
      //   <>
      //     <StyledTypography variant="h6" gutterBottom>
      //       Personal Info
      //     </StyledTypography>
      //     <PersonInfo personId={personId} />
      //   </>
      // }
      // main={
      //   <>
      //     <StyledTypography variant="h6" gutterBottom>
      //       Images
      //     </StyledTypography>
      //     <PersonImageGridList personId={personId} />
      //
      //     <StyledTypography variant="h6" gutterBottom>
      //       Castings
      //     </StyledTypography>
      //     <PersonCastingGridList personId={personId} />
      //   </>
      // }
    />
  );
}

export default PersonProfile;
