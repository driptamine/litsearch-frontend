import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

// Global audio playback: one <audio> element for the whole app, so music
// keeps playing while navigating between pages.
const PlayerContext = createContext(null);

export const usePlayer = () => useContext(PlayerContext);

const trackKey = (track) => String(track?.key ?? track?.pk ?? track?.id ?? track?.url ?? '');

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const current = index >= 0 && index < queue.length ? queue[index] : null;

  const playQueue = useCallback((tracks, startIndex = 0) => {
    const list = (tracks || []).map(track => ({
      key: trackKey(track),
      url: track.url || track.r2_url || track.gcs_url || track.preview_url || '',
      title: track.title || track.name || 'Track',
      artist: typeof track.artist === 'string'
        ? track.artist
        : (Array.isArray(track.artists)
          ? track.artists.map(item => typeof item === 'string' ? item : item?.name).filter(Boolean).join(', ')
          : ''),
    })).filter(track => track.url);
    if (!list.length) return;
    setQueue(list);
    setIndex(Math.min(Math.max(startIndex, 0), list.length - 1));
  }, []);

  const playTrack = useCallback((track, contextQueue) => {
    if (Array.isArray(contextQueue) && contextQueue.length) {
      const list = contextQueue;
      const at = list.findIndex(item => trackKey(item) === trackKey(track));
      playQueue(list, at >= 0 ? at : 0);
    } else {
      playQueue([track], 0);
    }
  }, [playQueue]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [current]);

  const seekTo = useCallback((seconds) => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    try {
      audio.currentTime = seconds;
      setCurrentTime(seconds);
    } catch (_) {}
  }, [current]);

  const next = useCallback(() => {
    if (queue.length < 2) return;
    setIndex(prev => (prev + 1) % queue.length);
  }, [queue.length]);

  const prev = useCallback(() => {
    if (queue.length < 2) return;
    setIndex(prev => (prev - 1 + queue.length) % queue.length);
  }, [queue.length]);

  const close = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      try { audio.pause(); } catch (_) {}
    }
    setPlaying(false);
    setIndex(-1);
    setQueue([]);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.dataset.key !== current.key) {
      audio.dataset.key = current.key;
      audio.src = current.url;
      setCurrentTime(0);
      setDuration(0);
    }
    audio.play().then(() => {}).catch(() => setPlaying(false));
  }, [current]);

  const isCurrentKey = useCallback((key) => !!current && current.key === String(key ?? ''), [current]);

  return (
    <PlayerContext.Provider value={{
      current, queue, playing, currentTime, duration,
      playQueue, playTrack, toggle, seekTo, next, prev, close, isCurrentKey,
    }}>
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime || 0)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onEnded={() => {
          if (queue.length > 1) {
            setIndex(prev => (prev + 1) % queue.length);
          } else {
            setPlaying(false);
          }
        }}
        onError={() => setPlaying(false)}
      />
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContext;
