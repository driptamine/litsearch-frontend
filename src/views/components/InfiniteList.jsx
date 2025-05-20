import React from "react";
import InfiniteScrollWrapper from "views/components/InfiniteScrollWrapper";
import BaseAlterList from "./BaseAlterList";

function InfiniteList({
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


      <BaseAlterList
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

export default InfiniteList;
