import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { styled } from '@linaria/react';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import VideoIntroduction from './VideoIntroduction';
import RecommendedVideo from 'views/components/video-player/web/RecommendedVideo';
import Comment from 'views/components/Comment';
import api_dataV2 from 'views/utils/api_data.json';
import { comments } from 'views/pages/VideoProfile/data/api_data';
import { useSelector } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import VideoEditModal from 'views/components/upload/uploader/posts/VideoEditModal';


function VideoProfile() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState(null);
  const currentUser = useSelector((state) => state.users);

  useEffect(() => {
    if (!videoId) return;
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`${LITLOOP_API_URL}/videos/${videoId}/`, { headers: authHeader() });
        setVideo(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

  const handleVideoUpdate = (updatedVideo) => {
    setVideo(updatedVideo);
  };

  const isOwner = video && currentUser && (video.user_id === currentUser.id || video.user?.id === currentUser.id);

  if (loading) return <LayoutContainer><MainContent><p>Loading...</p></MainContent></LayoutContainer>;
  if (!video) return <LayoutContainer><MainContent><p>Video not found.</p></MainContent></LayoutContainer>;

  return (
    <LayoutContainer>
      <MainContent>
        <VideoIntroduction
          videoId={videoId}
          url={video.r2_url || video.gcs_url || video.url}
        />
        <TitleRow>
          <h2>{video.title || video.name}</h2>
          {isOwner && (
            <EditBtn
              onClick={() => setEditingVideo(video)}
              title="Edit video"
            >
              <FaEdit size={16} />
            </EditBtn>
          )}
        </TitleRow>
        {video.description && <Description>{video.description}</Description>}
        <MetaRow>
          <span>{video.views_count || 0} views</span>
          <span>{video.likes_count || 0} likes</span>
        </MetaRow>
        <p>Comments</p>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </MainContent>

      <VideoWrapper>
        {api_dataV2.map((item, index) =>
          <RecommendedVideo
            url={item.url}
            key={index}
            light={item.thumbNail}
            viewsCount={item.viewsCount}
            likesCount={item.likesCount}
          />
        )}
      </VideoWrapper>
      {editingVideo && (
        <VideoEditModal
          video={editingVideo}
          onClose={() => setEditingVideo(null)}
          onUpdate={handleVideoUpdate}
        />
      )}
    </LayoutContainer>
  );
}


const Description = styled.p`
  color: var(--text);
  opacity: 0.8;
  margin: 8px 0;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 16px;
  color: var(--text);
  opacity: 0.6;
  font-size: 0.9rem;
  margin-bottom: 16px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const EditBtn = styled.button`
  background: transparent;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  opacity: 0.7;
  transition: opacity 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 1;
    color: #0084ff;
  }
`;

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
