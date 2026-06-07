import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    sidebar: true,
  },
  reducers: {
    openSidebar(state, action) {
      state.sidebar = true;
    },
    closeSidebar(state, action) {
      state.sidebar = false;
    },
    toggleSidebar(state) {
      state.sidebar = !state.sidebar;
    },
  },
});

export const { openSidebar, closeSidebar, toggleSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
