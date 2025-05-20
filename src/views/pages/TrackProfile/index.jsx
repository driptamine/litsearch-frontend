import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import styled from "styled-components"

// MATERIAL UNDONE
// import { Typography } from "@mui/material";
import { StyledTypography } from 'views/styledComponents';

// VIEWS
import Profile from "views/components/Profile";
import TrackIntroduction from "./TrackIntroduction";
// import TrackImageGridList from "./TrackImageGridList";
// import TrackVideoList from "./TrackVideoList";
// import TrackVideoRecommendations from "./TrackVideoRecommendations";
import StyledVideoCard from "./StyledVideoCard";
// import StyledVideoCard from "./StyledVideoCardV2";
// import VideoCard from "./VideoCard";

import VideoPlayer from "views/components/video-player/chatgpt/VideoPlayer"
import VideoPlayerV2 from "views/components/video-player/chatgpt/VideoPlayerV2"
import CustomPlayer from "views/components/video-player/web/CustomPlayer"
import CustomPlayerV2 from "views/components/video-player/web/CustomPlayerV2"
import CustomPlayerV3 from "views/components/video-player/web/CustomPlayerV3"
import CustomPlayerV4 from "views/components/video-player/web/CustomPlayerV4"
import CustomBardPlayer from "views/components/video-player/bard/CustomBardPlayer"
// import TrackCastGridList from "./TrackCastGridList";
import SimilarTracks from "./SimilarTracks";


// CORE
import { fetchTrack } from "core/actions";
import { selectors } from "core/reducers/index";
import { verifyCachedData } from "core/utils";


// STYLING
const api_data = [
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/%40onlymilitarycontent%3Avideo%3A7076002202753584390.mp4",
    url: "https://cdn.coverr.co/videos/coverr-desert-in-california-329/1080p.mp4",
    viewsCount: "1M",
    likesCount: "30K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/jet.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1618595714505-cfc44411d4d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-dunes-4546/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://cdn.coverr.co/videos/coverr-golden-gate-bridge-at-sunset-5420/1080p.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/049/801/original/DJI_0104.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://static.videezy.com/system/resources/previews/000/048/776/original/refinery01.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/r_Mvoq7Oliyrkej0t/videoblocks-v1-0002_dji_0748_r47ojmzkq__ae26123a57af1f09e97017a982c56a24__P360.mp4",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },
  {
    // url: "https://d1ca20q97pi6ei.cloudfront.net/Crystal+Castles+-+Kerosene(American+Psycho).mp4",
    url: "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa_video_1080_4800000.m3u8",
    viewsCount: "3.2M",
    likesCount: "100K",
    // thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",

    // thumbNail: "https%3A%2F%2Fd1ca20q97pi6ei.cloudfront.net%2Fthumbnail%2FCrystal%2BCastles%2B-%2BKerosene(American%2BPsycho)%2B.jpeg",
    thumbNail: "https://images.unsplash.com/photo-1560440293-855922f9cc7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",


    // thumbNail: "https://views-test-api.s3.us-west-1.amazonaws.com/thumbnail/Crystal+Castles+-+Kerosene(American+Psycho)+.jpeg",
  },

  // {
  //   url: "https://d1ca20q97pi6ei.cloudfront.net/%40staronka_%3Avideo%3A7168864865551912198.mp4",
  //   viewsCount: "5.3M",
  //   likesCount: "400K",
  //   thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/ukraine.jpeg",
  // },
  // {
  //   url: "https://d1ca20q97pi6ei.cloudfront.net/%40gudaniky%3Avideo%3A7033332221628992770.mp4",
  //   viewsCount: "4.2M",
  //   likesCount: "600K",
  //   thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/Screen+Shot+2022-12-13+at+05.43.17.png",
  // },
  // {
  //   url: "https://d1ca20q97pi6ei.cloudfront.net/%40x.wwvx%3Avideo%3A7117444737275055366%20homelander-patrick-scarface-the-fight-club.mp4",
  //   viewsCount: "2.3M",
  //   likesCount: "500K",
  //   thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/homelander+staring.jpeg",
  // },
  // {
  //   url: "https://d1ca20q97pi6ei.cloudfront.net/%40yearboyl%3Avideo%3A7015198041556684038.mp4",
  //   viewsCount: "1.7M",
  //   likesCount: "200K",
  //   thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/https-%3A%3Awww.tiktok.com%3A%40yearboyl%3Avideo%3A7015198041556684038.jpeg",
  // },
  // {
  //   url: "https://d1ca20q97pi6ei.cloudfront.net/%40scott._robertson%3Avideo%3A7126226880302288134.mp4",
  //   viewsCount: "2.9M",
  //   likesCount: "180K",
  //   thumbNail: "https://d1ca20q97pi6ei.cloudfront.net/thumbnail/brad.jpeg",
  // },
]

const VideoWrapper = styled.div`

  /* display: flex; */

  display: grid;
  grid-gap: 3em;
  /* grid-template-columns: repeat(3, 403px); */
  grid-template-columns: repeat(3, minmax(160px, 1fr));


  /* grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); */
`;

const ReStyledTypography = styled(StyledTypography)`
  color: white;
`;
const REQUIRED_FIELDS = ["tagline"];

function TrackProfile() {
  const dispatch = useDispatch();
  const { trackId } = useParams();
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingTrack(state, trackId)
  );
  const track = useSelector(state => selectors.selectTrack(state, trackId));

  useEffect(() => {
    dispatch(fetchTrack(trackId, REQUIRED_FIELDS));
  }, [trackId, dispatch]);


  const loading = isFetching || !verifyCachedData(track, REQUIRED_FIELDS);

  return (
    <Profile
      loading={loading}
      introduction={<TrackIntroduction trackId={trackId} />}
      main={
        <>

          <StyledTypography variant="h6" gutterBottom>Videos</StyledTypography>
          <VideoWrapper>
            {api_data.map((item, index) =>
                // <StyledVideoCard
                // <VideoCard
                // <VideoPlayer
                // <CustomPlayer
                // <CustomPlayerV2
                // <CustomPlayerV3
                <CustomPlayerV4
                // <CustomBardPlayer
                // <VideoPlayerV2
                  url={item.url}
                  key={index}
                  // light={item.url}
                  light={item.thumbNail}
                  viewsCount={item.viewsCount}
                  likesCount={item.likesCount}
                />
              )
            }
          </VideoWrapper>
          <StyledTypography variant="h6" gutterBottom>
            Recommendations
          </StyledTypography>
          {/*<TrackVideoRecommendations trackId={trackId} />*/}
        </>
      }

    />
  );
}

export default TrackProfile;
