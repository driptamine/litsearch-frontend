// REFERENCE: https://keyholesoftware.com/2022/07/13/cancel-a-react-modal-with-escape-key-or-external-click/

const KEY_NAME_ESC = 'Escape';
const KEY_EVENT_TYPE = 'keyup';

// CUSTOM
const KEY_NAME_SHIFT = 'shift';
const KEY_NAME_TAB = 'tab';

function useEscapeKey(handleClose) {
  const handleEscKey = useCallback((event) => {
    if (event.key === KEY_NAME_ESC) {
      handleClose();
    }
  }, [handleClose]);

  // CUSTOM
  const handleOverlayToggle = useCallback((event) => {
    if (event.key === KEY_NAME_SHIFT && event.key === KEY_NAME_TAB) {
      handleToggle();
    }
  }, [handleOverlayToggle]);


  useEffect(() => {
    document.addEventListener(KEY_EVENT_TYPE, handleEscKey, false);

    return () => {
      document.removeEventListener(KEY_EVENT_TYPE, handleEscKey, false);
    };
  }, [handleEscKey]);
}
