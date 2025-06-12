import React, {useState, useEffect, useRef, useCallback} from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { VideoCardUnsplash } from 'views/pages/VideoFeedProfile/VideoCardV2';
import { api_data } from 'views/pages/VideoFeedProfile/data/api_data.jsx';

import { VideoUploader } from 'views/components/upload/uploader/videos/VideoUploader'

const videos_data = api_data;


export const VideoFeedV2 = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(true);

  const [newSkeletonCount, setNewSkeletonCount] = useState(0);
  const perPage = 30; // match your API


  const observerRef = useRef(null);

  // useEffect(() => {
  //   // Simulate fetch delay
  //   const timer = setTimeout(() => {
  //     // setPhotos(api_data);
  //     setLoading(false);
  //   }, 3000);
  //
  //   return () => clearTimeout(timer);
  // }, []);
  const APIL = `http://localhost:8000`
  const ENDPOINT = `/photos`

  const API = `https://api.unsplash.com`
  const CLIENT_ID = `eri4WEuuCAynz46CN1cwMf_ITGhTRFUgmDv1YhB5aYA`
  const url = `${API}/users/driptamine/likes?per_page=30&client_id=${CLIENT_ID}`


  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setNewSkeletonCount(perPage); // show skeletons only for new items

      const res = await axios.get(
        `${API}/users/driptamine/likes?page=${page}&per_page=30&client_id=${CLIENT_ID}`
      );
      const newPhotos = res.data.map((item) => {
        let small = item.urls?.small;
        if (small) {
          const url = new URL(small);
          url.searchParams.set('w', '400'); // set width to 600
          small = url.toString();
        }

        return {
          id: item.id,
          small: small,
        }

      });
      // setPhotos((prev) => [...prev, ...urlsSmall]);
      setPhotos((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newUniquePhotos = newPhotos.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newUniquePhotos];
      });

      setTimeout(() => {
        setLoading(false);
        setNewSkeletonCount(0); // hide new skeletons
      }, 2000);

    } catch (error) {
      console.error('Error fetching Unsplash likes:', error);
      setLoading(false); // fail fast on error
    }
    // finally {
    //   setLoading(false);
    // }
  }, [page]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // IntersectionObserver to trigger pagination
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        rootMargin: '200px',
      }
    );

    const current = observerRef.current;
    if (current) observer.observe(current);
    return () => current && observer.unobserve(current);
  }, [loading]);

  const skeletonCount = 12;
  return (
    <Container>

      <Main>
      <VideoUploader />
      {/*<Grid>
        {photos.map((photo, i) => (
          <PhotoCardUnsplash key={photo?.id ?? i} photo={photo} loading={false} />
        ))}
      </Grid>*/}

      {/*<Grid>
        {(loading && photos.length === 0
          ? Array.from({ length: skeletonCount })  // initial skeleton
          : photos
        ).map((photo, i) => (
          <PhotoCardUnsplash key={photo?.id ?? `skeleton-${i}`} photo={photo} loading={loading} />
        ))}
      </Grid>*/}

      <Grid>
        {photos.map((photo) => (
          <VideoCardUnsplash key={photo.id} photo={photo} loading={false} />
        ))}

        {/* New skeletons only for next page */}
        {loading &&
          Array.from({ length: newSkeletonCount }).map((_, i) => (
            <VideoCardUnsplash key={`skeleton-${i}`} photo={null} loading={true} />
          ))}
      </Grid>

      <Loader ref={observerRef}>
        {loading && <span>Loading...</span>}
      </Loader>
      </Main>
    </Container>
  )
};

const Container = styled.div`
  display: flex;
`;

const Main = styled.main`
  flex: 1;
  padding: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
`;

const Loader = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #777;
`;

// export default VideoFeed;
