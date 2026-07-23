import { useCallback } from 'react';

const useVibrate = () => {
  const vibrate = useCallback((pattern = 10) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const vibrateLight = useCallback(() => vibrate(10), [vibrate]);
  const vibrateMedium = useCallback(() => vibrate(50), [vibrate]);
  const vibrateHeavy = useCallback(() => vibrate(100), [vibrate]);

  return { vibrate, vibrateLight, vibrateMedium, vibrateHeavy };
};

export default useVibrate;
