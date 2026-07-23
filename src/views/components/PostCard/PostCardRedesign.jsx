import React, { useState, useEffect, useRef, useCallback } from "react";
import { styled } from "@linaria/react";
import { Link } from "react-router-dom";
import LikeButton from "views/components/LikeButton/LikeButton";
import TrackRow from "views/components/TrackRow";
import CustomPlayerV4 from 'views/components/video-player/web/CustomPlayerV4';
import Impressions from 'views/components/Impressions';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const PostCardRedesign = ({ post, onLike, onDelete, formatPostTime, getFullUrl, observeRef }) => {
  const postId = post.id || post.post_id;
  const author = post.author || {};
  const avatarUrl = getFullUrl(author.avatar);
  const timeStr = post.created_at || post.timestamp || post.date;

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
      <TopRow>
        <AvatarCol>
          <Link to={`/${author.username || ""}`}>
            <Avatar src={avatarUrl} alt="" />
          </Link>
        </AvatarCol>
        <Header>
          <Link to={`/${author.username || ""}`} style={{ textDecoration: "none", color: "inherit" }}>
            <UserName>{author.username || "unknown"}</UserName>
          </Link>
          <Handle>@{author.username || "unknown"}</Handle>
          <Dot>·</Dot>
          <Time>
            <Link to={`/posts/${postId}`} style={{ textDecoration: "none", color: "inherit" }}>
              {formatPostTime(timeStr)}
            </Link>
          </Time>
          {author.is_own && (
            <KebabWrapper ref={kebabRef}>
              <KebabBtn onClick={(e) => { e.preventDefault(); e.stopPropagation(); setKebabOpen(o => !o); }}>⋮</KebabBtn>
              {kebabOpen && (
                <KebabDropdown>
                  <KebabItem onClick={(e) => { e.preventDefault(); e.stopPropagation(); closeKebab(); onDelete(postId); }}>Delete</KebabItem>
                </KebabDropdown>
              )}
            </KebabWrapper>
          )}
        </Header>
      </TopRow>

      <MainContent>
        <Body>
          {post.title && <Title>{post.title}</Title>}
          <Description>{post.description}</Description>
        </Body>

        {post.photos?.length > 0 && (
          <MediaGrid>
            {post.photos.map((photo) => (
              <MediaImg key={photo.id} src={photo.r2_url || photo.gcs_url} alt="" />
            ))}
          </MediaGrid>
        )}

        {post.videos?.map((video) => (
          <VideoBox key={video.id}>
            <CustomPlayerV4
              url={video.r2_url || video.gcs_url}
              />
          </VideoBox>
        ))}

        {post.tracks?.map((track, i) => (
          <TrackRow key={track.id || i} track={track} index={i} />
        ))}

        <Actions>
          <LikeButton
            isLiked={post.is_liked}
            likesCount={post.likes_count}
            showCount={post.likes_count > 0}
            onClick={() => onLike(postId)}
          />
          <CommentsLink to={`/posts/${postId}`}>
            <CommentIcon viewBox="0 0 24 24">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </CommentIcon>
            {post.comments_count > 0 && <span>{post.comments_count}</span>}
          </CommentsLink>
          <span style={{ flex: 1 }} />
          <Impressions count={post.impressions_count} />
        </Actions>
      </MainContent>
    </Card>
  );
};

const Card = styled.div`
  padding: 1em;
  border-bottom: 1px solid #333;
`;

const TopRow = styled.div`
  display: flex;
  gap: 12px;
`;

const AvatarCol = styled.div`
  flex-shrink: 0;
`;

const Avatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
`;

const MainContent = styled.div`
  min-width: 0;
  // margin-left: 56px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
`;

const UserName = styled.span`
  font-weight: 700;
  color: var(--text);
`;

const Handle = styled.span`
  color: #71767b;
  font-size: 0.9rem;
`;

const Dot = styled.span`
  color: #71767b;
`;

const Time = styled.span`
  color: #71767b;
  font-size: 0.85rem;
`;

const Body = styled.div`
  margin: 4px 0;
`;

const Title = styled.div`
  font-weight: 600;
  color: var(--text);
  margin-bottom: 2px;
`;

const Description = styled.div`
  color: var(--text);
  line-height: 1.4;
  white-space: pre-wrap;
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  margin: 8px 0;
`;

const MediaImg = styled.img`
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  max-height: 400px;
`;

const VideoBox = styled.div`
  margin: 8px 0;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
`;

const CommentsLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #71767b;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 20px;
  transition: all 0.2s;

  &:hover {
    color: #1d9bf0;
    background: rgba(29, 155, 240, 0.1);
  }
`;

const CommentIcon = styled.svg`
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
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
  text-align: left;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ff4d4d;
  }
`;

export default PostCardRedesign;
