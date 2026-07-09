import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { styled } from "@linaria/react";
import { Link } from "react-router-dom";
import { LITLOOP_API_URL } from "core/constants/urls";
import { authHeader } from "core/api/rest-helper";
import PostCard from "views/components/PostCard/PostCard";
import Impressions from 'views/components/Impressions';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

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
    if (!url) return '';
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
      const res = await axios.post(`${LITLOOP_API_URL}/posts/${postId}/like/`, null, { headers: authHeader() });
      const { liked, likes_count } = res.data;
      setPosts((prev) =>
        prev.map((p) =>
          (p.id || p.post_id) === postId ? { ...p, is_liked: liked, likes_count } : p
        )
      );
    } catch (err) {
      console.error('Like failed:', err);
      setPosts((prev) =>
        prev.map((p) => {
          if ((p.id || p.post_id) === postId) {
            const isLiked = !p.is_liked;
            return { ...p, is_liked: isLiked, likes_count: (p.likes_count || 0) + (isLiked ? -1 : 1) };
          }
          return p;
        })
      );
    }
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
              observeRef={observePost}
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
