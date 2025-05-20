// reducers/userReducer.js
const initialState = {
  userDetails: null,
  loading: false,
  error: null,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_USER_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_USER_SUCCESS':
      return { ...state, loading: false, userDetails: action.payload };
    case 'FETCH_USER_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
