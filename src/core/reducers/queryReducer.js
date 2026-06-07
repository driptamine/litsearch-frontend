// src/core/reducers/queryReducer.js
const initialState = {
  queries: [],
  loading: false,
  error: null,
};

export default function queryReducer(state = initialState, action) {
  switch (action.type) {
    case 'query/search/requested':
      return { ...state, loading: true, error: null };
    case 'query/search/succeeded':
      return { ...state, loading: false, queries: action.payload.results || action.payload, error: null };
    case 'query/search/failed':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
