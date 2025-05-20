import React from "react";
import  useInfiniteScroll  from "react-infinite-scroll-hook";

function InfiniteScrollWrapper({ hasNextPage, loading, onLoadMore, children }) {

  const [sentryRef] = useInfiniteScroll({
  // const [sentryRef, {rootRef}] = useInfiniteScroll({
    hasNextPage,
    loading,
    onLoadMore
  });

  return (
    <div ref={sentryRef} />
  )
}

export default InfiniteScrollWrapper;