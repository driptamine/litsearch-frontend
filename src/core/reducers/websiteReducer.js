// src/core/reducers/websiteReducer.js
const initialState = {
  websites: [],
  loading: false,
  error: null,
};

export default function websiteReducer(state = initialState, action) {
  switch (action.type) {
    case 'web/search/requested':
      return { ...state, loading: true, error: null };
    case 'web/search/succeeded':
      return { ...state, loading: false, websites: action.payload.results || action.payload, error: null };
    case 'web/search/failed':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
