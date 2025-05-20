import React, { useState, useEffect, useRef, useCallback } from 'react';

const PopularPosts = () => {
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
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=bceb6c0fefae8ee5a3cf9762ec780d63&page=${page}`

    setLoading(true);
    try {
      const newItems = await fetch(url).then(res => res.json());
      setItems((prevItems) => [...prevItems, ...newItems]);
      if (newItems.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   const fetchTracks = async () => {
  //     try {
  //       const response = await fetchData(`http://localhost:8000/playlist/2gA4jcmBkhaJAuCdQFl5JP`);
  //       setTracks(response.data);
  //     } catch (error) {
  //       console.error('Error fetching post:', error);
  //     }
  //   };
  //
  //   fetchTracks();
  // }, []);

  useEffect(() => {
    fetchItems(page);
  }, [page]);

  // bceb6c0fefae8ee5a3cf9762ec780d63
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

export default PopularPosts;
