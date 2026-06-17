import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { styled } from '@linaria/react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import LikeButton from 'views/components/LikeButton/LikeButton';
import TrackRow from 'views/components/TrackRow';
import CustomPlayerV4 from 'views/components/video-player/web/CustomPlayerV4';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const formatPostTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
  return d.toLocaleDateString();
};

function PostProfile() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${LITLOOP_API_URL}/posts/${postId}/`, {
          headers: authHeader()
        });
        setPost(res.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post.');
      } finally {
        setIsLoading(false);
      }
    };
    if (postId) fetchPost();
  }, [postId]);

  if (isLoading) return <Container><Message>Loading post...</Message></Container>;
  if (error) return <Container><Message error>{error}</Message></Container>;
  if (!post) return <Container><Message>Post not found.</Message></Container>;

  const author = post.author || post.user;
  const authorAvatar = author?.avatar || author?.profile_img || author?.profileImg;
  const authorName = author?.username || author?.name || 'Unknown';
  const timeStr = post.created_at || post.timestamp || post.date;

  const getFullUrl = (url) => {
    if (!url) return DEFAULT_AVATAR;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('//')) {
      return url.startsWith('//') ? `https:${url}` : url;
    }
    return `${LITLOOP_API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <Container>
      <FeedContainer>
        <FeedPost>
          <FeedAvatar src={getFullUrl(authorAvatar)} alt={authorName} />
          <FeedMainContent>
            <FeedHeader>
              <FeedUser>{authorName}</FeedUser>
              <FeedHandle>@{authorName}</FeedHandle>
              <FeedTime>· {formatPostTime(timeStr)}</FeedTime>
            </FeedHeader>
            <FeedBody>
              <FeedText>{post.description || post.content || ''}</FeedText>
              {(post.photos?.length > 0 || post.photo_ids?.length > 0) && (
                <FeedMedia>
                  {(post.photos || []).slice(0, 4).map(photo => (
                    <FeedImage key={photo.id || photo.pk} src={photo.gcs_url || photo.image || photo.file_path || photo.url || photo} alt="" />
                  ))}
                  {!post.photos?.length && (post.videos || []).slice(0, 1).map(video => (
                    <CustomPlayerV4 key={video.id || video.pk} url={video.gcs_url || video.file_path || video.url || video} />
                  ))}
                </FeedMedia>
              )}
              {(post.tracks || []).map((track, i) => (
                <TrackRow key={track.id || track.pk || i} track={track} index={i} />
              ))}
              <FeedActions>
                <LikeButton
                  isLiked={post.is_liked}
                  likesCount={post.likes_count}
                  onClick={() => {}}
                />
                {post.photo_ids?.length > 0 && <span>📷 {post.photo_ids.length}</span>}
                {post.video_ids?.length > 0 && <span>🎥 {post.video_ids.length}</span>}
                {post.track_ids?.length > 0 && <span>🎵 {post.track_ids.length}</span>}
              </FeedActions>
            </FeedBody>
          </FeedMainContent>
        </FeedPost>
      </FeedContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  min-height: 80vh;
  padding: 40px 20px;
  background: var(--body);
`;

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  border-left: 1px solid #333;
  border-right: 1px solid #333;
`;

const FeedPost = styled.div`
  padding: 15px;
  border-bottom: 1px solid #333;
  display: flex;
  gap: 12px;
  text-decoration: none;
  color: inherit;
`;

const FeedAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const FeedMainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
`;

const FeedHeader = styled.div`
  display: flex;
  gap: 5px;
  align-items: baseline;
  flex-wrap: wrap;
`;

const FeedUser = styled.span`
  color: var(--text);
  font-weight: 700;
  font-size: 1rem;
`;

const FeedHandle = styled.span`
  color: #71767b;
  font-size: 0.9rem;
`;

const FeedTime = styled.span`
  color: #71767b;
  font-size: 0.8rem;
  margin-left: 4px;
`;

const FeedBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeedText = styled.div`
  color: var(--text);
  font-size: 1rem;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const FeedMedia = styled.div`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #333;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2px;
`;

const FeedImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
`;

const FeedActions = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 425px;
  color: #71767b;
  font-size: 0.85rem;
  margin-top: 10px;
`;

const Message = styled.p`
  text-align: center;
  padding: 40px 20px;
  color: ${({ error }) => (error ? '#ff4d4d' : '#888')};
`;

export default PostProfile;
