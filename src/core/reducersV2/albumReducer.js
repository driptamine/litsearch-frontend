// reducers/albumReducer.js
const initialState = {
  albums: [],
  loading: false,
  error: null,
};

export default function albumReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_ALBUMS_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_ALBUMS_SUCCESS':
      return { ...state, loading: false, albums: action.payload };
    case 'FETCH_ALBUMS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
