import React from "react";
import InfiniteScrollWrapper from "views/components/InfiniteScrollWrapper";
import BaseListFlex from "./BaseListFlex";

function InfiniteListFlex({
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


      <BaseListFlex
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

export default InfiniteListFlex;
