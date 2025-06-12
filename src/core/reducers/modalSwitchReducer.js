// action types
export const PUSH_MODAL_LOCATION_KEY = 'PUSH_MODAL_LOCATION';
export const CLEAR_MODAL_LOCATION_KEYS = 'CLEAR_MODAL_LOCATION';
export const SET_MODAL_LOCATION_KEYS = 'SET_MODAL_LOCATION';

export const PUSH_BACKGROUND_LOCATION_KEY = 'PUSH_BACKGROUND_LOCATION';
export const CLEAR_BACKGROUND_LOCATION_KEYS = 'CLEAR_BACKGROUND_LOCATION';
export const SET_BACKGROUND_LOCATION_KEYS = 'SET_BACKGROUND_LOCATION';

// initial state
export const initialState = {
  modalLocationKeys: [],
  backgroundLocationKeys: []
};

// reducer
export function modalSwitchReducer(state, action) {
  switch (action.type) {
    case PUSH_MODAL_LOCATION_KEY: {
      const { modalLocationKeys } = state;
      const newKeys = [...modalLocationKeys, action.key];
      return { ...state, modalLocationKeys: newKeys };
    }
    case CLEAR_MODAL_LOCATION_KEYS:
      return { ...state, modalLocationKeys: [] };
    case SET_MODAL_LOCATION_KEYS:
      return { ...state, modalLocationKeys: action.modalLocationKeys };

    case PUSH_BACKGROUND_LOCATION_KEY: {
      const { backgroundLocationKeys } = state;
      const backgroundKeys = [...backgroundLocationKeys, action.key];
      return { ...state, backgroundLocationKeys: backgroundKeys };
    }
    case CLEAR_BACKGROUND_LOCATION_KEYS:
      return { ...state, backgroundLocationKeys: [] };
    case SET_BACKGROUND_LOCATION_KEYS:
      return { ...state, backgroundLocationKeys: action.backgroundLocationKeys };
    default:
      return state;
  }
}
