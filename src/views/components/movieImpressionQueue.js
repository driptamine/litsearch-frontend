import { useEffect } from 'react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';

const queue = new Set();

export function queueMovieImpression(dbId) {
  queue.add(dbId);
}

export function drainMovieImpressionQueue() {
  const ids = [...queue];
  queue.clear();
  return ids;
}

export function useMovieImpressionFlusher() {
  useEffect(() => {
    const timer = setInterval(async () => {
      const ids = drainMovieImpressionQueue();
      if (!ids.length) return;
      try {
        await axios.post(`${LITLOOP_API_URL}/movies/impressions/batch/`, { movie_ids: ids }, { headers: authHeader() });
      } catch (_) {}
    }, 3000);

    return () => {
      clearInterval(timer);
      const ids = drainMovieImpressionQueue();
      if (ids.length) {
        axios.post(`${LITLOOP_API_URL}/movies/impressions/batch/`, { movie_ids: ids }, { headers: authHeader() }).catch(() => {});
      }
    };
  }, []);
}
