import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// MATERIAL DONE
// import { Typography } from "@mui/material";
import { StyledTypography } from "views/styledComponents";

// VIEWS
import Profile from "views/components/Profile";
import MovieIntroduction from "./MovieIntroduction";
import MovieIntroductionV2 from "./MovieIntroductionV2";
// import MovieImageGridList from "./MovieImageGridList";
// import MovieVideoList from "./MovieVideoList";
import MovieCastGridList from "./MovieCastGridList";
import Recommendations from "./Recommendations";
import Skeleton from "views/skeletons/HomeSkeleton";


import { fetchMovie } from "core/actions";
import { selectors } from "core/reducers/index";
import { verifyCachedData } from "core/utils";

const REQUIRED_FIELDS = ["tagline"];

function MovieProfile({stopSong, pauseSong, resumeSong, audioControl}) {
  const dispatch = useDispatch();
  const { movieId } = useParams();
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingMovie(state, movieId)
  );
  const movie = useSelector(state => selectors.selectMovie(state, movieId));

  useEffect(() => {
    dispatch(fetchMovie(movieId, REQUIRED_FIELDS));
  }, [movieId, dispatch]);

  const loading = isFetching || !verifyCachedData(movie, REQUIRED_FIELDS);

  // if (isFetching) {
  //   return <Skeleton title={true} />;
  // }

  return (
    <Profile
      loading={loading}
      introduction={<MovieIntroductionV2 movieId={movieId} obj={movie} />}
      // introduction={<MovieIntroductionV2 movieId={movieId}  />}
      // introduction={<MovieIntroduction movieId={movieId} />}
      main={
        <>
          <StyledTypography variant="h6" gutterBottom>
            Videos
          </StyledTypography>
          {/*<MovieVideoList movieId={movieId} />*/}
          <StyledTypography variant="h6" gutterBottom>
            Images
          </StyledTypography>
          {/*<MovieImageGridList movieId={movieId} />*/}
          <StyledTypography variant="h6" gutterBottom>
            Recommendations
          </StyledTypography>
          <Recommendations movieId={movieId} />
        </>
      }

    />
  );
}

export default MovieProfile;
