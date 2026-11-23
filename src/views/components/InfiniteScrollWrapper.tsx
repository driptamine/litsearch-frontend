import React, { useEffect, useRef } from 'react';

function InfiniteScrollWrapper({ hasNextPage, loading, onLoadMore }) {
  const sentryRef = useRef(null);
  const loadingRef = useRef(loading);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    if (!sentryRef.current || !hasNextPage || loading) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          onLoadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentryRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, loading, onLoadMore]);

  return <div ref={sentryRef} style={{ minHeight: 1 }} />;
}

export default InfiniteScrollWrapper;
