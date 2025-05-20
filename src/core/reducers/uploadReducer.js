import { ADD_DATA, PROGRESS_BAR } from "../actions/types";

const initialState = {
  progress: {},
  data: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case PROGRESS_BAR:
      return {
        ...state,
        progress: action.payload,
      };

    case ADD_DATA:
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
}
