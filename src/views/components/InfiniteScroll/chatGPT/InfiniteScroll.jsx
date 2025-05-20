import React, { useState, useEffect, useRef, useCallback } from 'react';

const InfiniteScroll = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const lastItemRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore]);

  const fetchItems = async (page) => {
    setLoading(true);
    try {
      const newItems = await fetch(`https://api.example.com/items?page=${page}`).then(res => res.json());
      setItems((prevItems) => [...prevItems, ...newItems]);
      if (newItems.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems(page);
  }, [page]);

  return (
    <div>
      {items.map((item, index) => {
        if (items.length === index + 1) {
          return <div ref={lastItemRef} key={index} className="item">{item.name}</div>;
        } else {
          return <div key={index} className="item">{item.name}</div>;
        }
      })}
      {loading && <p>Loading more items...</p>}
    </div>
  );
};
