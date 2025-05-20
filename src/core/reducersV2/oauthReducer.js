// reducers/oauthReducer.js
const initialState = {
  token: null,
  loading: false,
  error: null,
};

export default function oauthReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, token: action.payload };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
