import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";
export const fetchNotification = createAsyncThunk(
  "Notification/fetchNotification",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/notificaions");
      return response.data;
    } catch (error) {
      console.error("Fetch notifications failed:", error);
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const approveNotification = createAsyncThunk(
  "Notification/approveNotification",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/getemployeebyid", {
        params: { id },
      });
      return response.data;
    } catch (error) {
      console.error("Approve notification failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);
export const deleteNotification = createAsyncThunk(
  "Notification/approveNotification",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/deleteNotification", {
        n_id: id,
      });
      return response.data;
    } catch (error) {
      console.error("Approve notification failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);

// Initial state
const initialState = {
  NotificationData: [],
};

// Slice
const authSlice = createSlice({
  name: "Notification",
  initialState,
  reducers: {
    setNotificationData: (state, action) => {
      state.NotificationData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotification.fulfilled, (state, action) => {
      state.NotificationData = action.payload;
    });
    builder.addCase(approveNotification.fulfilled, (state, action) => {});
  },
});

export const { setNotificationData } = authSlice.actions;
export default authSlice.reducer;
