import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { styled } from '@linaria/react';

// MATERIAL DONE
// import { Typography } from '@mui/material';
import { StyledTypography } from 'views/styledComponents';
import Profile from 'views/components/Profile';
import VideoIntroduction from './VideoIntroduction';
import CustomPlayerV4 from 'views/components/video-player/web/CustomPlayerV4';
import RecommendedVideo from 'views/components/video-player/web/RecommendedVideo';
import CommentV4 from 'views/pages/AlbumProfile/CommentV4';
import App from 'views/pages/AlbumProfile/Tree/App';
import RedditApp from 'views/pages/AlbumProfile/Tree/RedditApp';

// import MovieImageGridList from './MovieImageGridList';
// import MovieVideoList from './MovieVideoList';
// import MovieCastGridList from './MovieCastGridList';
// import Recommendations from './Recommendations';

// CORE
import { selectors } from 'core/reducers/index';
import { verifyCachedData } from 'core/utils';
import { fetchMovie } from 'core/actions';

const REQUIRED_FIELDS = ["tagline"];

import api_dataV2 from 'views/utils/api_data.json';
import { api_data } from 'views/pages/VideoProfile/data/api_data';
import { comments } from 'views/pages/VideoProfile/data/api_data';


function VideoProfile() {
  const dispatch = useDispatch();
  const { videoId } = useParams();
  // const isFetching = useSelector(state =>
  //   selectors.selectIsFetchingVideo(state, videoId)
  // );
  // const video = useSelector(state => selectors.selectVideo(state, videoId));
  //
  // useEffect(() => {
  //   dispatch(fetchVideo(videoId, REQUIRED_FIELDS));
  // }, [videoId, dispatch]);

  // const loading = isFetching || !verifyCachedData(video, REQUIRED_FIELDS);

  // return (
  //   <Profile
  //     // loading={loading}
  //     introduction={<VideoIntroduction videoId={videoId} url={api_data[5].url} />}
  //     main={
  //       <>
  //
  //
  //
  //         <VideoWrapper>
  //           {api_data.map((item, index) =>
  //               // <StyledVideoCard
  //               // <VideoCard
  //               // <VideoPlayer
  //               // <CustomPlayer
  //               // <CustomPlayerV2
  //               // <CustomPlayerV3
  //               <CustomPlayerV4
  //               // <CustomBardPlayer
  //               // <VideoPlayerV2
  //                 url={item.url}
  //                 key={index}
  //                 // light={item.url}
  //                 light={item.thumbNail}
  //                 viewsCount={item.viewsCount}
  //                 likesCount={item.likesCount}
  //               />
  //             )
  //           }
  //         </VideoWrapper>
  //       </>
  //     }
  //
  //   />
  // );




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
    <LayoutContainer>
      <MainContent>
        <VideoIntroduction
          videoId={videoId}
          // url={api_data[5].url}
          url={videoSrc}

          />
        <h2>{title}</h2>
        <p>Comments</p>
        {comments.map((comment) => (
          <CommentV4 key={comment.id} comment={comment} />
        ))}

        {/*<App/>*/}
        {/*<RedditApp/>*/}
      </MainContent>

      <VideoWrapper>
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
    </LayoutContainer>

    </>
  );


}

const LayoutContainer = styled.div`
  display: flex;
  justify-content: space-evenly;

  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 800px;
`;

const VideoWrapper = styled.div`
  width: 490px;
  padding-left: 1em;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(3, 152px);

  @media screen and (max-width: 900px) {
    width: 100%;
    margin-top: 2em;
    padding-left: 0;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

export default VideoProfile;
