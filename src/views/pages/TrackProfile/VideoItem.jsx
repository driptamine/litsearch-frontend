import React from "react";
import BaseImage from "views/components/BaseImage";
import BaseCard from "views/components/BaseCard";
import { useSelector } from "react-redux";

import RouterLink from "views/components/RouterLink";
import ModalLink from "views/components/ModalLink";
import { makeStyles } from "@mui/material/styles";
import { selectors } from "core/reducers/index";
import BaseCardHeader from "views/components/BaseCardHeader";
import MovieRatingTag from "./MovieRatingTag";
import { getAspectRatioString } from "./AspectRatio";
import { useConfiguration } from "./ConfigurationProvider";


import { connect } from 'react-redux';
import styled from 'styled-components';
import { withRouter} from 'react-router-dom';
import Button from 'views/components/Button';
import LikeIcon from 'views/components/LikeIcon';
import {screenLargerThan} from "views/style/util"
// import { likePhoto, unLikePhoto } from '../../actions/photo';
import { fetchLikeAlbum, fetchUnLikeAlbum } from "core/actions";
import {
  primaryColor1,
  white,
  likeColor,
  greenColor,
} from 'views/style/colors';


const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: "none"
  }
}));

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
  ${screenLargerThan.tablet`
    flex-direction: column;
    height: auto;
    border: none;
    color: ${white} !important;
    background-color: red !important;
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

function VideoItem({ videoId, subheader, handleLikePhoto, handleUnLikePhoto }) {
  // const classes = useStyles();
  const video = useSelector(state => selectors.selectVideo(state, videoId));
  const { getImageUrl } = useConfiguration();
  const m3u8_url = "https://mutantium.stream.voidboost.cc/1/5/1/6/7/2/b1507d3c8cf5bd6c36d090edb94cdbd6:2021091109:b1hsaC83YXU2MFlJa2UzNnd6dkg3YXJEcmx4ZHV2bHIwTUVyMzd5ZXZtVW9IUHY5Yy9TNVdZdVExSllYMXdyZXhqc2xsN0ZDanorY3ZhV2xwVjRlcXc9PQ==/goaum.mp4:hls:manifest.m3u8"

  function renderItem(video) {
    // if (videoId.images && videoId.images.length) {
      // return album.images[0].url;
      // return album.images[0].url;
      return m3u8_url;
    // } else {
      // return null;

    // }
  }


  return (
    <ModalLink to={`/video/${trackId}`}>
      <BaseCard hasActionArea>
        <BaseImage
          src={album.images[0] ? album.images[0].url : ""}
          alt={album.name}
          aspectRatio={getAspectRatioString(3, 3)}
        />
        {/*<BaseVideo
          src={album.images[0] ? album.images[0].url : ""}
          alt={album.name}
          aspectRatio={getAspectRatioString(3, 3)}
        />*/}

        <BaseCardHeader  subheader={subheader} />

      </BaseCard>
    </ModalLink>
  );
}

// export default AlbumCard;


export default withRouter(
  connect(
    null,
    {
      // handleLikePhoto: likePhoto,
      // handleUnLikePhoto: unLikePhoto,
      handleLikePhoto: fetchLikeAlbum,
      handleUnLikePhoto: fetchUnLikeAlbum,
      // onPush: push,
    }
  )(VideoItem)
);
