import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { styled } from "@linaria/react";
import { LITLOOP_API_URL } from "core/constants/urls";
import { authHeader } from "core/api/rest-helper";
import { fetchPopularPosts } from "core/actions";
import { selectors } from "core/reducers/index";
import PostCardRedesign from "views/components/PostCard/PostCardRedesign";

const FeedPage = () => {
  const dispatch = useDispatch();
  const feedPostIds = useSelector(state => selectors.selectFeedPostIds(state));
  const isFetching = useSelector(state => selectors.selectIsFetchingFeedPosts(state));
  const nextPage = useSelector(state => selectors.selectFeedPostsNextPage(state));
  const posts = useSelector(state =>
    feedPostIds.map(id => selectors.selectPost(state, id)).filter(Boolean)
  );

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

  useEffect(() => {
    dispatch(fetchPopularPosts(1));
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!nextPage) return;
    dispatch(fetchPopularPosts(nextPage));
  };

  const getFullUrl = (url) => {
    if (!url) return "";
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
    try {
      const res = await axios.post(`${LITLOOP_API_URL}/posts/${postId}/like/`, null, { headers: authHeader() });
      const { liked, likes_count } = res.data;
      dispatch({
        type: "POST/LIKE/SUCCEEDED",
        payload: { postId, liked, likes_count },
      });
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`${LITLOOP_API_URL}/posts/delete_no_drf/${postId}/`, { headers: authHeader() });
      dispatch({ type: "POST/DELETE/SUCCEEDED", payload: { postId } });
      dbReady.then(async () => {
        const rec = await db.posts.where("apiId").equals(postId).first();
        if (rec) await db.posts.delete(rec.id);
      }).catch(() => {});
    } catch {}
  };

  if (isFetching && feedPostIds.length === 0) {
    return <Wrapper><LoadingText>Loading feed...</LoadingText></Wrapper>;
  }

  return (
    <Wrapper>
      <FeedHeader>
        <h2>Feed</h2>
      </FeedHeader>
      {posts.length === 0 && !isFetching ? (
        <LoadingText>No posts yet.</LoadingText>
      ) : (
        <>
          {posts.map((post) => (
            <PostCardRedesign
              key={post.id}
              post={post}
              onLike={handleLike}
              onDelete={handleDelete}
              formatPostTime={formatPostTime}
              getFullUrl={getFullUrl}
              observeRef={observePost}
            />
          ))}
          {nextPage && (
            <LoadMoreBtn onClick={handleLoadMore} disabled={isFetching}>
              {isFetching ? "Loading..." : "Load more"}
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
  padding-bottom: 70px;
  border-left: 1px solid #333;
  border-right: 1px solid #333;
`;

const FeedHeader = styled.div`
  padding: 0 16px 16px;
  border-bottom: 1px solid #333;
  h2 { margin: 0; color: var(--text); }
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
