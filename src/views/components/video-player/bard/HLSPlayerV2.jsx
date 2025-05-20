import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

const HlsPlayerV2 = ({ source }) => {
  const videoRef = useRef();

  useEffect(() => {
    const hls = new Hls();

    hls.loadSource(source);
    hls.attachMedia(videoRef.current);

    return () => {
      hls.destroy();
    };
  }, [source]);

  return (
    <video
      ref={videoRef}
      controls
      style={{
        width: `10%`
      }}
    />
  );
};

export default HlsPlayerV2;
