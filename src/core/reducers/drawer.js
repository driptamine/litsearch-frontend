import * as actions from "core/actions";
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false
};

const drawer = createReducer(initialState, {
  [actions.toggleDrawer]: (state, action) => {
    state.isOpen = !state.isOpen;
  }
});

export default drawer;

export const selectors = {
  selectIsDrawerOpen: state => state.isOpen
};
