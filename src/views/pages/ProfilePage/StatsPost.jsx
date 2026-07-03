import React, { useState, useEffect, useRef, useCallback } from 'react';
import { styled } from '@linaria/react';
import { Link } from 'react-router-dom';
import LikeButton from 'views/components/LikeButton/LikeButton';
import TrackRow from 'views/components/TrackRow';
import CustomPlayerV4 from 'views/components/video-player/web/CustomPlayerV4';
import Impressions from 'views/components/Impressions';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const Card = styled.div`
  padding: 1em;
  padding-bottom: 1em;
  margin: 1em auto;
  width: 95%;
  max-width: 550px;
  border: 1.6px solid #383838;
  background: var(--cardColor);
  border-radius: 10px;
  display: flex;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  @media screen and (max-width: 425px) {
    padding-bottom: 3em;
  }
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
`;

const Header = styled.div`
  display: flex;
  gap: 5px;
  align-items: baseline;
  flex-wrap: wrap;
`;

const User = styled.span`
  color: var(--text);
  font-weight: 700;
  font-size: 1rem;
`;

const Handle = styled.span`
  color: #71767b;
  font-size: 0.9rem;
`;

const TimeLink = styled(Link)`
  color: #71767b;
  font-size: 0.8rem;
  margin-left: 4px;
`;

const KebabWrapper = styled.div`
  position: relative;
  margin-left: auto;
`;

const KebabBtn = styled.button`
  background: none;
  border: none;
  color: #71767b;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const KebabDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  z-index: 100;
  min-width: 120px;
`;

const KebabItem = styled.button`
  display: block;
  width: 100%;
  background: none;
  border: none;
  color: #ccc;
  padding: 10px 16px;
  font-size: 0.85rem;
  cursor: pointer;
  text-align: left;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Text = styled.div`
  color: var(--text);
  font-size: 1rem;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const Media = styled.div`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #333;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2px;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: var(--text);
  column-gap: 8px;
`;

const StatsLeft = styled.div`
  display: flex;
  align-items: center;
  column-gap: 20px;
`;

const StatsRight = styled.div`
  display: flex;
  align-items: center;
`;

const EditForm = styled.div`
  margin: 8px 0;
`;

const EditTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  background: #111;
  color: white;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #0084ff;
  }
`;

const EditActionsRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const SaveButton = styled.button`
  background: #0084ff;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  &:hover {
    background: #0073e6;
  }
`;

const CancelButton = styled.button`
  background: transparent;
  color: #888;
  border: 1px solid #555;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  &:hover {
    color: white;
    border-color: #888;
  }
`;

const StatsPost = ({
  post,
  username,
  isOwnProfile,
  onLike,
  onDelete,
  onEdit,
  onStartEdit,
  onCancelEdit,
  editingPostId,
  editingDescription,
  onEditingDescriptionChange,
  observeRef,
  formatPostTime,
  getFullUrl,
}) => {
  const postId = post.id || post.post_id;
  const author = post.author || post.user;
  const authorAvatar = getFullUrl?.(author?.avatar || author?.profile_img || author?.profileImg) || DEFAULT_AVATAR;
  const authorName = author?.username || author?.name || username;
  const timeStr = post.created_at || post.timestamp || post.date;
  const isEditing = editingPostId === postId;

  const [kebabOpen, setKebabOpen] = useState(false);
  const kebabRef = useRef(null);

  const closeKebab = useCallback(() => setKebabOpen(false), []);

  useEffect(() => {
    if (!kebabOpen) return;
    const handler = (e) => {
      if (kebabRef.current && !kebabRef.current.contains(e.target)) closeKebab();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [kebabOpen, closeKebab]);

  return (
    <Card ref={(el) => observeRef?.(el, postId)}>
      <Avatar src={authorAvatar} alt={authorName} />
      <MainContent>
        <Header>
          <User>{authorName}</User>
          <Handle>@{authorName}</Handle>
          <TimeLink to={`/posts/${postId}`}>· {formatPostTime?.(timeStr) || timeStr}</TimeLink>
          {isOwnProfile && !isEditing && (
            <KebabWrapper ref={kebabRef}>
              <KebabBtn onClick={(e) => { e.preventDefault(); e.stopPropagation(); setKebabOpen(o => !o); }}>⋮</KebabBtn>
              {kebabOpen && (
                <KebabDropdown>
                  <KebabItem onClick={(e) => { e.preventDefault(); e.stopPropagation(); closeKebab(); onStartEdit?.(post); }}>Edit</KebabItem>
                  <KebabItem onClick={(e) => { e.preventDefault(); e.stopPropagation(); closeKebab(); onDelete?.(postId); }}>Delete</KebabItem>
                </KebabDropdown>
              )}
            </KebabWrapper>
          )}
        </Header>
        <Body>
          {isEditing ? (
            <EditForm>
              <EditTextarea
                value={editingDescription}
                onChange={(e) => onEditingDescriptionChange?.(e.target.value)}
                autoFocus
              />
              <EditActionsRow>
                <SaveButton onClick={() => onEdit?.(postId)}>Save</SaveButton>
                <CancelButton onClick={onCancelEdit}>Cancel</CancelButton>
              </EditActionsRow>
            </EditForm>
          ) : (
            <Text>{post.description}</Text>
          )}
          {post.photos?.length > 0 || post.videos?.length > 0 ? (
          <Media>
            {post.photos?.slice(0, 4).map((photo) => (
              <Image key={photo.id} src={photo.r2_url || photo.gcs_url} alt="Post content" />
            ))}
            {!post.photos?.length && post.videos?.slice(0, 1).map((video) => (
              <CustomPlayerV4 key={video.id} url={video.r2_url || video.gcs_url} />
            ))}
          </Media>
          ) : null}
          {post.tracks?.map((track, i) => (
            <TrackRow key={track.id || i} track={track} index={i} />
          ))}
          <Actions>
            <StatsLeft>
              <LikeButton
                isLiked={post.is_liked}
                likesCount={post.likes_count}
                onClick={() => onLike?.(postId)}
              />
              {post.photo_ids?.length > 0 && <span>📷 {post.photo_ids.length}</span>}
              {post.video_ids?.length > 0 && <span>🎥 {post.video_ids.length}</span>}
              {post.track_ids?.length > 0 && <span>🎵 {post.track_ids.length}</span>}
            </StatsLeft>
            <StatsRight>
              <Impressions count={post.impressions_count} />
            </StatsRight>
          </Actions>
        </Body>
      </MainContent>
    </Card>
  );
};

export default StatsPost;
