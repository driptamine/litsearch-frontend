import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { styled } from "@linaria/react";
import { Link } from "react-router-dom";
import { LITLOOP_API_URL } from "core/constants/urls";
import { authHeader } from "core/api/rest-helper";
import LikeButton from "views/components/LikeButton/LikeButton";
import TrackRow from "views/components/TrackRow";

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const PostCard = ({ post, onLike, onDelete, formatPostTime, getFullUrl }) => {
  const postId = post.id || post.post_id;
  const author = post.author || {};
  const avatarUrl = getFullUrl(author.avatar);
  const timeStr = post.created_at || post.timestamp || post.date;

  return (
    <Card>
      <AvatarCol>
        <Link to={`/${author.username || ""}`}>
          <Avatar src={avatarUrl} alt="" />
        </Link>
      </AvatarCol>
      <MainContent>
        <Header>
          <Link to={`/${author.username || ""}`} style={{ textDecoration: "none", color: "inherit" }}>
            <UserName>{author.username || "unknown"}</UserName>
          </Link>
          <Handle>@{author.username || "unknown"}</Handle>
          <Dot>·</Dot>
          <Time>{formatPostTime(timeStr)}</Time>
        </Header>

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
            <video src={video.r2_url || video.gcs_url} controls style={{ width: "100%", borderRadius: 8 }} />
          </VideoBox>
        ))}

        {post.tracks?.map((track, i) => (
          <TrackRow key={track.id || i} track={track} index={i} />
        ))}

        <Actions>
          <LikeButton
            isLiked={post.is_liked}
            likesCount={post.likes_count}
            onClick={() => onLike(postId)}
          />
          {author.is_own && (
            <DeleteBtn onClick={() => onDelete(postId)}>Delete</DeleteBtn>
          )}
        </Actions>
      </MainContent>
    </Card>
  );
};

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    axios.get(`${LITLOOP_API_URL}/posts/feed/`, { params: { page: 1 }, headers: authHeader() })
      .then((res) => {
        setPosts(res.data.posts || []);
        setHasNext(res.data.has_next);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const loadMore = () => {
    if (loadingMore || !hasNext) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    axios.get(`${LITLOOP_API_URL}/posts/feed/`, { params: { page: nextPage }, headers: authHeader() })
      .then((res) => {
        setPosts((prev) => [...prev, ...(res.data.posts || [])]);
        setPage(nextPage);
        setHasNext(res.data.has_next);
        setLoadingMore(false);
      })
      .catch(() => setLoadingMore(false));
  };

  const getFullUrl = (url) => {
    if (!url) return DEFAULT_AVATAR;
    if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("//")) {
      return url.startsWith("//") ? `https:${url}` : url;
    }
    return `${LITLOOP_API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const formatPostTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if ((p.id || p.post_id) === postId) {
          const isLiked = !p.is_liked;
          return { ...p, is_liked: isLiked, likes_count: (p.likes_count || 0) + (isLiked ? 1 : -1) };
        }
        return p;
      })
    );
    try {
      await axios.post(`${LITLOOP_API_URL}/posts/${postId}/like/`, null, { headers: authHeader() });
    } catch {}
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    setPosts((prev) => prev.filter((p) => (p.id || p.post_id) !== postId));
    try {
      await axios.delete(`${LITLOOP_API_URL}/posts/delete_no_drf/${postId}/`, { headers: authHeader() });
    } catch {}
  };

  if (loading) return <Wrapper><LoadingText>Loading feed...</LoadingText></Wrapper>;

  return (
    <Wrapper>
      <FeedHeader>
        <h2>Feed</h2>
      </FeedHeader>
      {posts.length === 0 ? (
        <LoadingText>No posts yet.</LoadingText>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post.id || post.post_id}
              post={post}
              onLike={handleLike}
              onDelete={handleDelete}
              formatPostTime={formatPostTime}
              getFullUrl={getFullUrl}
            />
          ))}
          {hasNext && (
            <LoadMoreBtn onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? "Loading..." : "Load more"}
            </LoadMoreBtn>
          )}
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 0;
`;

const FeedHeader = styled.div`
  padding: 0 16px 16px;
  border-bottom: 1px solid #333;
  h2 { margin: 0; color: var(--text); }
`;

const Card = styled.div`
  display: flex;
  gap: 12px;
  padding: 1em;
  border-bottom: 1px solid #333;
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
  flex: 1;
  min-width: 0;
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

const DeleteBtn = styled.button`
  background: none;
  border: 1px solid #555;
  color: #888;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 3px 10px;
  border-radius: 4px;
  &:hover { color: #ff4d4d; border-color: #ff4d4d; }
`;

const LoadMoreBtn = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 24px;
  background: #1d9bf0;
  color: #fff;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover { background: #1a8cd8; }
  &:disabled { opacity: 0.5; cursor: default; }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: #888;
`;

export default FeedPage;
