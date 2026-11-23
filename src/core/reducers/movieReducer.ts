const initialState = {
  movies: [],
  loading: false,
  error: null,
};

const movieReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'movie/fetchPopular/request':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'movie/fetchPopular/success':
      return {
        ...state,
        loading: false,
        movies: action.payload, // Movie data from the API
        error: null,
      };
    case 'movie/fetchPopular/failure':
      return {
        ...state,
        loading: false,
        error: action.payload, // Error message from the Saga
      };
    default:
      return state;
  }
};

export default movieReducer;
