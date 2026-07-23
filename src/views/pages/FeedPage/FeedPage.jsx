import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { styled } from "@linaria/react";
import { Link } from "react-router-dom";
import { LITLOOP_API_URL } from "core/constants/urls";
import { authHeader } from "core/api/rest-helper";
import PostCardRedesign from "views/components/PostCard/PostCardRedesign";
import PostCard from "views/components/PostCard/PostCard";
import Impressions from 'views/components/Impressions';
import { db, dbReady } from 'core/db/db';

async function upsertFeedPosts(posts, now) {
  const existing = await db.posts.toArray();
  const map = new Map(existing.map(e => [e.apiId, e]));
  const adds = [];
  const updates = [];
  for (const item of posts) {
    const apiId = item.id || item.post_id;
    const rec = map.get(apiId);
    if (rec) {
      updates.push(db.posts.update(rec.id, { ...item, apiId, updatedAt: now }));
    } else {
      adds.push({ ...item, apiId, createdAt: item.created_at || now, updatedAt: now });
    }
  }
  await Promise.all(updates);
  if (adds.length) await db.posts.bulkAdd(adds);
  const apiIds = new Set(posts.map(p => p.id || p.post_id));
  const stale = existing.filter(e => !apiIds.has(e.apiId));
  if (stale.length) await Promise.all(stale.map(e => db.posts.delete(e.id)));
}

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
    (async () => {
      await dbReady;
      try {
        const cached = await db.posts.orderBy('createdAt').reverse().toArray();
        if (cached.length) {
          setPosts(cached.map(p => { const { apiId, ...rest } = p; return { ...rest, id: apiId }; }));
        }
      } catch {}
      try {
        const res = await axios.get(`${LITLOOP_API_URL}/posts/feed/`, { params: { page: 1 }, headers: authHeader() });
        const feedPosts = res.data.posts || [];
        setPosts(feedPosts);
        setHasNext(res.data.has_next);
        const now = new Date().toISOString();
        await upsertFeedPosts(feedPosts, now);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const loadMore = () => {
    if (loadingMore || !hasNext) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    axios.get(`${LITLOOP_API_URL}/posts/feed/`, { params: { page: nextPage }, headers: authHeader() })
      .then(async (res) => {
        const newPosts = res.data.posts || [];
        setPosts((prev) => [...prev, ...newPosts]);
        setPage(nextPage);
        setHasNext(res.data.has_next);
        setLoadingMore(false);
        const now = new Date().toISOString();
        await upsertFeedPosts(newPosts, now);
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
    dbReady.then(async () => {
      const rec = await db.posts.where('apiId').equals(postId).first();
      if (rec) {
        const isLiked = !(rec.is_liked);
        await db.posts.update(rec.id, { is_liked: isLiked, likes_count: (rec.likes_count || 0) + (isLiked ? 1 : -1) });
      }
    }).catch(() => {});
    try {
      const res = await axios.post(`${LITLOOP_API_URL}/posts/${postId}/like/`, null, { headers: authHeader() });
      const { liked, likes_count } = res.data;
      setPosts((prev) =>
        prev.map((p) =>
          (p.id || p.post_id) === postId ? { ...p, is_liked: liked, likes_count } : p
        )
      );
      dbReady.then(async () => {
        const rec = await db.posts.where('apiId').equals(postId).first();
        if (rec) await db.posts.update(rec.id, { is_liked: liked, likes_count });
      }).catch(() => {});
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
    dbReady.then(async () => {
      const rec = await db.posts.where('apiId').equals(postId).first();
      if (rec) await db.posts.delete(rec.id);
    }).catch(() => {});
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
            <PostCardRedesign
            // <PostCard
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
