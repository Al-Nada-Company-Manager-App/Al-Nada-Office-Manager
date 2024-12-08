import { createSlice } from '@reduxjs/toolkit';

const homeMenuSlice = createSlice({
  name: 'homeMenu',
  initialState: {
    collapsed: false,
    currentContent: '1',
  },
  reducers: {
    toggleCollapsed: (state) => {
      state.collapsed = !state.collapsed;
    },
    setCurrentContent: (state, action) => {
      state.currentContent = action.payload;
    },
  },
});

export const { toggleCollapsed, setCurrentContent } = homeMenuSlice.actions;
export default homeMenuSlice.reducer;
