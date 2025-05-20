import React from "react";
import InfiniteScrollWrapper from "views/components/InfiniteScrollWrapper";
import BaseGridList from "./BaseGridList";

function InfiniteGridList({
  items,
  loading,
  hasNextPage,
  onLoadMore,
  renderItem,
  minItemWidth,
  spacing,
  keyExtractor
}) {
  return (
    <>


      <BaseGridList
        keyExtractor={keyExtractor}
        items={items}
        loading={loading || hasNextPage}
        minItemWidth={minItemWidth}
        spacing={spacing}
        renderItem={renderItem}
      />


      <InfiniteScrollWrapper
        loading={loading}
        hasNextPage={hasNextPage}
        onLoadMore={onLoadMore}
      />
    </>
  );
}

export default InfiniteGridList;
