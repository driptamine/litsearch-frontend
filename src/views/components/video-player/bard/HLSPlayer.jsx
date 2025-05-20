import React, {useEffect, useRef} from 'react';
import Hls from 'hls.js';

const HlsPlayer = ({ src }) => {
  const hlsPlayerRef = useRef();

  const initializeHlsPlayer = () => {
    const hlsPlayer = new Hls();
    hlsPlayer.loadSource(src);
    hlsPlayer.attachMedia(hlsPlayerRef.current);

    return hlsPlayer;
  };

  useEffect(() => {
    const hlsPlayer = initializeHlsPlayer();

    return () => {
      hlsPlayer.destroy();
    };
  }, [src]);

  return (
    <video ref={hlsPlayerRef} />
  );
};

export default HlsPlayer;
