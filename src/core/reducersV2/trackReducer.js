// reducers/trackReducer.js
const initialState = {
  tracks: [],
  loading: false,
  error: null,
};

export default function trackReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_TRACKS_REQUEST':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_TRACKS_SUCCESS':
      return {
        ...state,
        loading: false,
        tracks: action.payload
      };
    case 'FETCH_TRACKS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
}
