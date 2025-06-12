import { useEffect, useRef, useReducer, useState, useCallback, useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  modalSwitchReducer,
  initialState,
  PUSH_MODAL_LOCATION_KEY,
  CLEAR_MODAL_LOCATION_KEYS,
  SET_MODAL_LOCATION_KEYS,
  PUSH_BACKGROUND_LOCATION_KEY,
  SET_BACKGROUND_LOCATION_KEYS,
} from 'core/reducers/modalSwitchReducer';

export function useModalSwitchLogic() {
  const location = useLocation();
  const history = useHistory();
  const backgroundLocation = useRef(location);
  const [state, dispatch] = useReducer(modalSwitchReducer, initialState);
  const [startedWithModal, setStartedWithModal] = useState();

  const { modalLocationKeys, backgroundLocationKeys } = state;

  const checkIfStartedWithModals = useCallback(() => {
    return !!(location.state && location.state.modal && location.state.defaultParentPath);
  }, [location]);

  useEffect(() => {
    const locationKey = location.key;
    const keysLength = modalLocationKeys.length;
    const backgroundKeysLength = backgroundLocationKeys.length;

    function clearModalLocationKeys() {
      if (modalLocationKeys.length) {
        dispatch({ type: CLEAR_MODAL_LOCATION_KEYS });
      }
    }

    function handleHistoryNavigation() {
      if (keysLength) {
        const index = modalLocationKeys.indexOf(locationKey);
        let newKeys = modalLocationKeys;

        if (index >= 0 && index !== modalLocationKeys.length - 1) {
          // Browser's "back" button is clicked
          newKeys = newKeys.slice(0, index + 1);
        } else if (index < 0) {
          // Key not found, likely "forward" button is clicked
          newKeys = [...newKeys, locationKey];
        }
        dispatch({ type: SET_MODAL_LOCATION_KEYS, modalLocationKeys: newKeys });
      }
    }

    function handleBackgroundHistoryNavigation() {
        if (backgroundKeysLength) {
            const index = backgroundLocationKeys.indexOf(locationKey);
            let newKeys = backgroundLocationKeys;

            if (index >= 0 && index !== backgroundKeysLength - 1) {
                newKeys = newKeys.slice(0, index + 1);
            } else if (index < 0) {
                newKeys = [...newKeys, locationKey];
            }
            dispatch({ type: SET_BACKGROUND_LOCATION_KEYS, backgroundLocationKeys: newKeys });
        }
    }

    function splitPathnameAndQueryString(path) {
      const [pathname, search] = path.split('?');
      return { pathname, search: search ? `?${search}` : '' };
    }

    if (checkIfStartedWithModals()) {
      const { pathname, search, key } = splitPathnameAndQueryString(location.state.defaultParentPath);
      backgroundLocation.current = { pathname, search, key, hash: 'checkIfStartedWithModals' };
      clearModalLocationKeys();
      setStartedWithModal(true);
    } else if (!location.state || !location.state.modal) {
      backgroundLocation.current = location;
      clearModalLocationKeys();
      if (!backgroundLocationKeys.includes(backgroundLocation.current.pathname)) {
        dispatch({ type: PUSH_BACKGROUND_LOCATION_KEY, key: backgroundLocation.current.pathname });
      }
      setStartedWithModal(false);
    } else if (!startedWithModal) {
      if (history.action === 'POP') {
        handleHistoryNavigation();
        handleBackgroundHistoryNavigation();
      } else if (history.action !== 'REPLACE') {
        if (!modalLocationKeys.includes(locationKey)) {
          dispatch({ type: PUSH_MODAL_LOCATION_KEY, key: locationKey });
        }
      }
    }
  }, [location, history, modalLocationKeys, backgroundLocationKeys, startedWithModal, checkIfStartedWithModals]);

  const redirectToBack = useCallback(() => {
    const prevLocation = backgroundLocation.current;
    if (modalLocationKeys.length) {
      history.go(-modalLocationKeys.length);
    } else {
      history.push(prevLocation.pathname);
    }
  }, [history, modalLocationKeys.length]);

  const isModal = !!(location.state && location.state.modal && backgroundLocation.current !== location); // not initial render when backgroundLocation == location
  const switchLocation = isModal ? backgroundLocation.current : location;

  useEffect(() => {
    document.body.style.overflow = isModal ? 'hidden' : 'visible';
  }, [isModal]);

  const contextValue = useMemo(() => ({
    redirectToBack,
    backgroundLocation: backgroundLocation.current,
    isModal
  }), [isModal, redirectToBack]);

  return { isModal, switchLocation, contextValue, pathname: location.pathname };
}
