import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  "userProfile/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/updateUserProfile", profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default userProfileSlice.reducer;