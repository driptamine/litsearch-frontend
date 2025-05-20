// reducers/playlistReducer.js
const initialState = {
  playlists: [],
  loading: false,
  error: null,
};

export default function playlistReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_PLAYLISTS_REQUEST':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_PLAYLISTS_SUCCESS':
      return {
        ...state,
        loading: false,
        playlists: action.payload
      };
    case 'FETCH_PLAYLISTS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
}
