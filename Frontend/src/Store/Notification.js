import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";
import { setSelectedUser } from "./Users";
import { setselectedDebt } from "./Debts";
import { setSelecteditem } from "./Product";
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
      thunkAPI.dispatch(setSelectedUser(response.data));
      return response.data;
    } catch (error) {
      console.error("Approve notification failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);
export const expireNotification = createAsyncThunk(
  "Notification/expireNotification",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/getproductbyid", {
        params: { id },
      });
      thunkAPI.dispatch(setSelecteditem(response.data));
      return response.data;
    } catch (error) {
      console.error("Approve notification failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);
export const debtNotification = createAsyncThunk(
  "Notification/debtNotification",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/getdebtbyid", {
        params: { id },
      });
      thunkAPI.dispatch(setselectedDebt(response.data));
      return response.data;
    } catch (error) {
      console.error("Approve notification failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);
export const deleteNotification = createAsyncThunk(
  "Notification/deleteNotification",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/deleteNotification", {
        id,
      });
      return response.data;
    } catch (error) {
      console.error("Approve notification failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);
export const addNotification = createAsyncThunk(
  "Notification/addNotification",
  async (data, thunkAPI) => {
    try {
      console.log(data);
      const response = await axiosInstance.post("/sendNotification", data);
      return response.data;
    } catch (error) {
      console.error("Add notification failed:", error);
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
  },
});

export const { setNotificationData } = authSlice.actions;
export default authSlice.reducer;
