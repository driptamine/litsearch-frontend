import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import axios from 'axios';
import { styled } from '@linaria/react';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import { Link } from 'react-router-dom';
import LikeButton from 'views/components/LikeButton/LikeButton';
import PostCard from 'views/components/PostCard';
import TrackRow from 'views/components/TrackRow';
import StatsPost from './StatsPost';
import ClassicPost from './ClassicPost';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const UserPosts = ({ username, newPosts = [], isOwnProfile = false }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('feed');
  const [feedLayout, setFeedLayout] = useState('stats');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingDescription, setEditingDescription] = useState('');
  useEffect(() => {
    const fetchUserPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${LITLOOP_API_URL}/posts/user/${username}/`);
        setPosts(response.data.results || response.data);
      } catch (err) {
        console.error('Error fetching user posts:', err);
        setError('Failed to load posts.');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserPosts();
    }
  }, [username]);

  const getFullUrl = (url) => {
    if (!url) return DEFAULT_AVATAR;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('//')) {
      return url.startsWith('//') ? `https:${url}` : url;
    }
    return `${LITLOOP_API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleLike = async (postId) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if ((post.id || post.post_id) === postId) {
        const isLiked = !post.is_liked;
        return {
          ...post,
          is_liked: isLiked,
          likes_count: (post.likes_count || 0) + (isLiked ? 1 : -1)
        };
      }
      return post;
    }));

    try {
      await axios.post(`${LITLOOP_API_URL}/posts/${postId}/like/`, null, { headers: authHeader() });
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;

    const deleted = posts.find(p => (p.id || p.post_id) === postId);
    setPosts(prev => prev.filter(p => (p.id || p.post_id) !== postId));

    try {
      await axios.delete(`${LITLOOP_API_URL}/posts/delete_no_drf/${postId}/`, { headers: authHeader() });
    } catch (err) {
      console.error('Error deleting post:', err);
      if (deleted) setPosts(prev => [...prev, deleted]);
    }
  };

  const startEditing = (post) => {
    setEditingPostId(post.id || post.post_id);
    setEditingDescription(post.description || '');
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditingDescription('');
  };

  const handleEdit = async (postId) => {
    const prev = posts.find(p => (p.id || p.post_id) === postId);

    setPosts(prevPosts => prevPosts.map(post => {
      if ((post.id || post.post_id) === postId) {
        return { ...post, description: editingDescription };
      }
      return post;
    }));
    setEditingPostId(null);
    setEditingDescription('');

    try {
      await axios.put(`${LITLOOP_API_URL}/posts/update_no_drf/${postId}/`,
        { description: editingDescription },
        { headers: authHeader() }
      );
    } catch (err) {
      console.error('Error editing post:', err);
      if (prev) setPosts(prevPosts => prevPosts.map(p =>
        (p.id || p.post_id) === postId ? prev : p
      ));
    }
  };

  const impressionQueueRef = useRef(new Set());
  const seenPostsRef = useRef(new Set());
  const flushTimerRef = useRef(null);
  const feedObserverRef = useRef(null);

  const flushImpressions = useCallback(async () => {
    const ids = [...impressionQueueRef.current];
    if (!ids.length) return;
    impressionQueueRef.current = new Set();
    try {
      await axios.post(`${LITLOOP_API_URL}/posts/impressions/batch/`, { post_ids: ids }, { headers: authHeader() });
      setPosts(prev => prev.map(p => ids.includes(p.id || p.post_id) ? { ...p, impressions_count: (p.impressions_count || 0) + 1 } : p));
    } catch (_) {}
  }, []);

  useEffect(() => {
    flushTimerRef.current = setInterval(flushImpressions, 3000);
    return () => {
      clearInterval(flushTimerRef.current);
      flushImpressions();
    };
  }, [flushImpressions]);

  const observePost = useCallback((el, postId) => {
    if (!el || !feedObserverRef.current) return;
    el.dataset.postId = postId;
    feedObserverRef.current.observe(el);
  }, []);

  useEffect(() => {
    seenPostsRef.current = new Set();
    feedObserverRef.current = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.postId;
          if (id && !seenPostsRef.current.has(id)) {
            seenPostsRef.current.add(id);
            impressionQueueRef.current.add(Number(id));
            feedObserverRef.current.unobserve(entry.target);
          }
        }
      }
    }, { threshold: 0.5 });
    return () => feedObserverRef.current?.disconnect();
  }, []);

  const allPosts = useMemo(() => {
    const fetchedPosts = Array.isArray(posts) ? posts : [];
    const localNewPosts = Array.isArray(newPosts) ? newPosts : [];
    const postIds = new Set(fetchedPosts.map(p => p.id || p.post_id));
    const uniqueNewPosts = localNewPosts.filter(p => !postIds.has(p.id || p.post_id));
    return [...uniqueNewPosts, ...fetchedPosts];
  }, [posts, newPosts]);

  if (isLoading) return <LoadingMessage>Loading posts...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!allPosts || allPosts.length === 0) return <NoPosts>No posts yet.</NoPosts>;

  const formatPostTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderGrid = () => (
    <PostsGrid>
      {allPosts.map(post => {
        const postId = post.id || post.post_id;
        const timeStr = post.created_at || post.timestamp || post.date;
        const isEditing = editingPostId === postId;
        return (
          <PostCard key={postId}>
            <Link to={`/posts/${postId}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <MediaPreview>
                {post.photos?.slice(0, 1).map(photo => (
                  <PostThumbnail key={photo.id} src={photo.gcs_url} alt="Post content" />
                ))}
                {!post.photos?.length && post.videos?.slice(0, 1).map(video => (
                  <VideoPreview key={video.id} src={video.gcs_url} />
                ))}
                {post.thumbnail && !post.photos?.length && !post.videos?.length && (
                  <PostThumbnail src={post.thumbnail} alt={post.title} />
                )}
                {!post.thumbnail && !post.photos?.length && !post.videos?.length && (
                   <Placeholder>No Media</Placeholder>
                )}
              </MediaPreview>
            </Link>

            <PostContent>
              <Link to={`/posts/${postId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <PostTitle>{post.title || (post.description ? (post.description.substring(0, 30) + (post.description.length > 30 ? '...' : '')) : 'Post')}</PostTitle>
              </Link>
              {isEditing ? (
                <EditForm>
                  <EditTextarea
                    value={editingDescription}
                    onChange={e => setEditingDescription(e.target.value)}
                    autoFocus
                  />
                  <EditActions>
                    <SaveButton onClick={() => handleEdit(postId)}>Save</SaveButton>
                    <CancelButton onClick={cancelEditing}>Cancel</CancelButton>
                  </EditActions>
                </EditForm>
              ) : (
                <PostDescription>{post.description?.substring(0, 100)}{post.description?.length > 100 ? '...' : ''}</PostDescription>
              )}

              <PostTime>{formatPostTime(timeStr)}</PostTime>

              {post.tracks?.map((track, i) => (
                <TrackRow key={track.id || i} track={track} index={i} />
              ))}

              <PostMeta>
                <LikeButton
                  isLiked={post.is_liked}
                  likesCount={post.likes_count}
                  onClick={() => handleLike(postId)}
                />
                {post.photo_ids?.length > 0 && <span>📷 {post.photo_ids.length}</span>}
                {post.video_ids?.length > 0 && <span>🎥 {post.video_ids.length}</span>}
                {post.track_ids?.length > 0 && <span>🎵 {post.track_ids.length}</span>}
                {isOwnProfile && !isEditing && (
                  <PostActions>
                    <ActionBtn onClick={() => startEditing(post)}>Edit</ActionBtn>
                    <ActionBtn onClick={() => handleDelete(postId)}>Delete</ActionBtn>
                  </PostActions>
                )}
              </PostMeta>
            </PostContent>
          </PostCard>
        );
      })}
    </PostsGrid>
  );

  const renderFeed = () => {
    const PostComponent = feedLayout === 'stats' ? StatsPost : ClassicPost;
    return (
    <FeedContainer>
      {allPosts.map(post => {
        const postId = post.id || post.post_id;
        return (
          <PostComponent
            key={postId}
            post={post}
            username={username}
            isOwnProfile={isOwnProfile}
            onLike={handleLike}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onStartEdit={startEditing}
            onCancelEdit={cancelEditing}
            editingPostId={editingPostId}
            editingDescription={editingDescription}
            onEditingDescriptionChange={setEditingDescription}
            observeRef={observePost}
            formatPostTime={formatPostTime}
            getFullUrl={getFullUrl}
          />
        );
      })}
    </FeedContainer>
  );
  };

  const renderGallery = () => (
    <GalleryGrid>
      {allPosts.map(post => {
        const postId = post.id || post.post_id;
        return (
          <GalleryCard key={postId} to={`/posts/${postId}`}>
            <GalleryMedia>
              {post.photos?.length > 0 ? (
                <GalleryImage src={post.photos[0].gcs_url} alt="Post content" />
              ) : post.videos?.length > 0 ? (
                <GalleryVideo src={post.videos[0].gcs_url} />
              ) : post.thumbnail ? (
                <GalleryImage src={post.thumbnail} alt={post.title} />
              ) : (
                <Placeholder>No Media</Placeholder>
              )}
              <GalleryOverlay className="gallery-overlay">
                <LikeButton
                  isLiked={post.is_liked}
                  likesCount={post.likes_count}
                  onClick={() => handleLike(postId)}
                  activeColor="white"
                  inactiveColor="white"
                  hoverColor="#ddd"
                />
                <span>💬 0</span>
                {isOwnProfile && (
                  <GalleryActionBtn onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(postId); }}>
                    🗑️
                  </GalleryActionBtn>
                )}
              </GalleryOverlay>
            </GalleryMedia>
          </GalleryCard>
        );
      })}
    </GalleryGrid>
  );

  return (
    <>
      <ObserverOverlay>
        <ObserverLabel>IO viewport (threshold 0.5)</ObserverLabel>
      </ObserverOverlay>
    <Wrapper>
      <ViewSwitcher>
        <ViewButton active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>Grid</ViewButton>
        <ViewButton active={viewMode === 'feed'} onClick={() => setViewMode('feed')}>Feed</ViewButton>
        <ViewButton active={viewMode === 'gallery'} onClick={() => setViewMode('gallery')}>Gallery</ViewButton>
        {viewMode === 'feed' && (
          <LayoutToggle>
            <LayoutBtn active={feedLayout === 'stats'} onClick={() => setFeedLayout('stats')}>Stats</LayoutBtn>
            <LayoutBtn active={feedLayout === 'classic'} onClick={() => setFeedLayout('classic')}>Classic</LayoutBtn>
          </LayoutToggle>
        )}
      </ViewSwitcher>

      {viewMode === 'grid' && renderGrid()}
      {viewMode === 'feed' && renderFeed()}
      {viewMode === 'gallery' && renderGallery()}
    </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const ViewSwitcher = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #333;
  padding-bottom: 15px;
`;

const viewButtonStyles = props => `
  background: ${props.active ? '#0084ff' : 'transparent'};
  color: ${props.active ? 'white' : '#888'};
  border: 1px solid ${props.active ? '#0084ff' : '#444'};
  &:hover {
    background: ${props.active ? '#0084ff' : 'rgba(255, 255, 255, 0.05)'};
    border-color: ${props.active ? '#0084ff' : '#666'};
  }
`;

const ViewButton = styled.button`
  ${viewButtonStyles}
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
`;

const LayoutToggle = styled.div`
  display: flex;
  gap: 4px;
`;

const layoutBtnStyles = props => `
  background: ${props.active ? '#333' : 'transparent'};
  color: ${props.active ? 'white' : '#888'};
  border: 1px solid ${props.active ? '#555' : '#444'};
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${props.active ? '#333' : 'rgba(255,255,255,0.05)'};
  }
`;

const LayoutBtn = styled.button`
  ${layoutBtnStyles}
`;

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 600px;
  margin: 0 auto;
  border-left: 1px solid #333;
  border-right: 1px solid #333;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  width: 100%;
  max-width: 935px;
  margin: 0 auto;

  @media (max-width: 768px) {
    gap: 2px;
  }
`;

const GalleryCard = styled(Link)`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-color: #1a1a1a;
  overflow: hidden;

  &:hover .gallery-overlay {
    opacity: 1;
  }
`;

const GalleryMedia = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GalleryVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GalleryOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  opacity: 0;
  transition: opacity 0.2s;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;

  span {
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;

const GalleryActionBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px;
`;

const MediaPreview = styled.div`
  width: 100%;
  height: 200px;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const VideoPreview = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Placeholder = styled.div`
  color: #444;
  font-size: 0.8rem;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
`;

const PostThumbnail = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid #333;
`;

const PostContent = styled.div`
  padding: 15px;
`;

const PostTitle = styled.h4`
  margin: 0 0 10px 0;
  color: white;
  font-size: 1.1rem;
`;

const PostDescription = styled.p`
  margin: 0 0 15px 0;
  color: #aaa;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const PostTime = styled.span`
  color: #666;
  font-size: 0.8rem;
  display: block;
  margin-bottom: 10px;
`;

const PostMeta = styled.div`
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 0.8rem;
  align-items: center;
`;

const PostActions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
`;

const ActionBtn = styled.button`
  background: none;
  border: 1px solid #555;
  color: #888;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 3px 10px;
  border-radius: 4px;

  &:hover {
    color: white;
    border-color: #888;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #888;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #ff4d4d;
`;

const NoPosts = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  background-color: #1a1a1a;
  border-radius: 12px;
  border: 1px dashed #444;
  width: 100%;
`;

const ObserverOverlay = styled.div`
  position: fixed;
  inset: 0;
  border: 2px dashed rgba(0, 255, 100, 0.5);
  pointer-events: none;
  z-index: 9999;
`;

const ObserverLabel = styled.div`
  position: fixed;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: #0f6;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  z-index: 9999;
  pointer-events: none;
  font-family: monospace;
`;

export default UserPosts;
