import React , { useState, useEffect }from "react";
import { connect, useSelector } from "react-redux";
import { Link, withRouter} from 'react-router-dom';

import styled from 'styled-components';



// MATERIAL DONE
// import { Typography, Box, Grid, makeStyles } from "@mui/material";
import { StyledTypography, StyledBox, StyledGrid } from 'views/styledComponents';
// import * as SC from 'views/styledComponents';

// import Rating from "./Rating";
// import { getTrackReleaseYear, getImdbProfileUrl } from "core/utils";
import Introduktion from "views/components/Introduktion";
import ImdbLogo from "views/components/ImdbLogo";
import TrackGenreChip from "./TrackGenreChip";

import BaseImage from "views/components/BaseImage";
import { getAspectRatioString } from "views/components/AspectRatio";
import { useConfiguration } from "views/components/ConfigurationProvider";


import Button from 'views/components/Button';
import LikeIcon from 'views/components/LikeIcon';
import {screenLargerThan} from "views/style/util";
import { primaryColor1, white, likeColor, greenColor,} from 'views/style/colors';
// import { likePhoto, unLikePhoto } from '../../actions/photo';

import { fetchLikeTrack, fetchUnLikeTrack } from "core/actions";
import { selectors } from "core/reducers/index";
import useDocumentTitle from "core/hooks2/useDocumentTitle"





// const useStyles = makeStyles(theme => ({
//   year: {
//     color: theme.palette.text.secondary
//   },
//   tagline: {
//     fontStyle: "italic"
//   },
//   genreChip: {
//     margin: theme.spacing(0.5)
//   },
//   overview: {
//     whiteSpace: "pre-wrap"
//   }
// }));


const LikedBtn = styled(Button)`
  display: flex;
  align-items: center;
  margin: 0;
  ${props =>
    props.likedByUser &&
    `
    background-color: ${likeColor};
    color: ${white};
    &:hover {
      color: ${white};
      border-color: transparent !important;
    }
  `};
  ${screenLargerThan.giant`
    flex-direction: column;
    height: auto;
    border: none;
    color: ${white} !important;
    background-color: transparent !important;
    svg {
      fill: ${white};
      color: ${white};
    }
    ${props =>
      props.likedByUser &&
      `
        svg {
          fill: ${likeColor};
          color: ${white};
        }
      `};
    &:hover {
      color: ${white};
    }
  `};
`;

const LikesCounter = styled.span`
  margin: 0px 6px;
`;

const ReStyledTypography = styled(StyledTypography)`
  color: ${props => props.theme.text};
`;
const StyledLink = styled(Link)`
  color: ${props => props.theme.text};

  font-weight: bold;
  
  text-decoration: none;

  &:hover: {
    text-decoration: underline;
  }
`;

const ReBaseImage = styled.img`
  width: 10%;
`;

function TrackIntroduction({ trackId, handleLikePhoto, handleUnLikePhoto }) {
  const [name, setName] = useState(null);
  const track = useSelector(state => selectors.selectTrack(state, trackId));
  // const classes = useStyles();

  // useDocumentTitle(track.name)
  // useDocumentTitle(track)



  // const releaseYear = getTrackReleaseYear(track);

  if (!track) {
    return null;
  }

  const linkList = track.artists.map((artist) => {
    return (
      <li key={artist.id}>
        <Link
          to={`/artist/${artist.id}/`}
          style={{ color: '#FFF' }}
          >
          {artist.name}
        </Link>
      </li>
    );
  });



  return (
    <Introduktion
      obj={track}
      backgroundImageSrc={track.album.images[0] ? track.album.images[0].url : ""}
      imageSrc={
        <>

          {/*<SC.Box flexBasis={100}>*/}
          <StyledBox flexBasis={100}>
            <ReBaseImage
              src={track.album.images[0] ? track.album.images[0].url : ""}
              aspectRatio={getAspectRatioString(1, 1)}
            />
          </StyledBox>
        </>

      }
      title={
        <>
          <ReStyledTypography variant="h5" gutterBottom={!track.tagline}>
            {track.name}  <br/>{track.artists.map((artist, i) =>
                <span key={i}>
                  {i > 0 && ", "}
                  <StyledLink
                    to={`/artist/${artist.id}/`}
                    // style={{
                    //   fontWeight: "bold",
                    //   color: '#FFF',
                    //   textDecoration: 'none',
                    //   "&:hover": {
                    //     textDecoration: "underline"
                    //   }
                    // }}
                    >

                    {artist.name}
                  </StyledLink>
                </span>
              )
            }

          </ReStyledTypography>
          {track.tagline && (
            <StyledTypography
              // className={classes.tagline}
              color="textSecondary"
              gutterBottom
            >
              {`"${track.tagline}"`}
            </StyledTypography>
          )}
        </>
      }
      content={
        <>
          <StyledGrid container spacing={2}>
            <StyledGrid item xs={12}>
              <StyledBox display="flex" alignItems="center">
                {/*<Rating value={track.vote_average * 10} />
                <Box marginLeft={2}>
                  <Link
                    href={getImdbProfileUrl(track.imdb_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ImdbLogo />
                  </Link>
                </Box>*/}
                {/*{linkList}*/}
              </StyledBox>
            </StyledGrid>


          </StyledGrid>
        </>
      }
      likeButton={
        <>
          <LikedBtn likedByUser={track.is_liked}
            onClick={() =>
              track.is_liked
                ? handleUnLikePhoto(track)
                : handleLikePhoto(track)
            }>
            <LikeIcon
              size={18}
              color={track.is_liked ? white : likeColor}
              hoverColor={track.is_liked ? white : likeColor}
            />
            <LikesCounter>{track.total_likes}</LikesCounter>
          </LikedBtn>
        </>
      }

    />
  );
}

// uploadButton={
//   <>
//     <LikedBtn
//       onClick={() =>
//         {/*handleuploadVideo()*/}
//
//       }>
//       <LikeIcon
//         size={18}
//
//       />
//       {/*<LikesCounter>{track.total_likes}</LikesCounter>*/}
//     </LikedBtn>
//   </>
// }
// export default TrackIntroduction;

export default withRouter(
  connect(
    null,
    {
      // handleLikePhoto: likePhoto,
      // handleUnLikePhoto: unLikePhoto,
      handleLikePhoto: fetchLikeTrack,
      handleUnLikePhoto: fetchUnLikeTrack,
      // onPush: push,
    }
  )(TrackIntroduction)
);
