import { useCallback } from 'react';

const useVibrate = () => {
  const vibrate = useCallback((pattern = 10) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const vibrateLight = useCallback(() => vibrate(10), [vibrate]);
  const vibrateMedium = useCallback(() => vibrate(20), [vibrate]);
  const vibrateHeavy = useCallback(() => vibrate(40), [vibrate]);

  return { vibrate, vibrateLight, vibrateMedium, vibrateHeavy };
};

export default useVibrate;
