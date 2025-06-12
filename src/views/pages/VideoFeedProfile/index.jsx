import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { StyledTypography } from 'views/styledComponents';
import Profile from 'views/components/Profile';
import VideoIntroduction from 'views/pages/VideoProfile/VideoIntroduction';
import CustomPlayerV4 from 'views/components/video-player/web/CustomPlayerV4';
import RecommendedVideo from 'views/components/video-player/web/RecommendedVideo';
import CommentV4 from 'views/pages/AlbumProfile/CommentV4';
import App from 'views/pages/AlbumProfile/Tree/App';
import RedditApp from 'views/pages/AlbumProfile/Tree/RedditApp';


// CORE
import { selectors } from 'core/reducers/index';
import { verifyCachedData } from 'core/utils';
import { fetchMovie } from 'core/actions';

const REQUIRED_FIELDS = ["tagline"];

import api_dataV2 from 'views/utils/api_data.json';
import { api_data } from 'views/pages/VideoProfile/data/api_data';
import { comments } from 'views/pages/VideoProfile/data/api_data';


export const VideoFeedProfile = () => {
  const dispatch = useDispatch();
  const { videoId } = useParams();

 
  const [videoSrc, setVideoSrc] = useState(null);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/videos/media/call/${videoId}`);

        console.log(response.data.dirname);
        setVideoSrc(response.data.hls_file); // Assuming response.data.videoUrl contains the HLS URL (.m3u8)
        setTitle(response.data.name); // Assuming response.data.videoUrl contains the HLS URL (.m3u8)
      } catch (e) {
        console.log(e);
        setError(error);
      }
    };

    fetchVideo();
  }, []);


  return (
    <>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly'
      }}

    >


      <VideoWrapper
        style={{width: '490px'}}
      >
        {api_dataV2.map((item, index) =>
            // <StyledVideoCard
            // <VideoCard
            // <VideoPlayer
            // <CustomPlayer
            // <CustomPlayerV2
            // <CustomPlayerV3
            // <CustomPlayerV4
            <RecommendedVideo
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

      {/*<Section>*/}

      {/*</Section>*/}
    </div>

    </>
  );


}

const VideoWrapper = styled.div`

  /* display: flex; */
  padding-left: 1em;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(3, 152px);
  /* grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); */
`;
