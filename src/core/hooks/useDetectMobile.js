import { useState, useEffect } from 'react';

function useDetectMobile() {
  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 768px)").matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handler = (event) => setIsMobile(event.matches);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

export default useDetectMobile;
