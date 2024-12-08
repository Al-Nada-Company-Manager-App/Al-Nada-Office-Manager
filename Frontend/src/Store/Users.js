import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";

export const checkSession = createAsyncThunk(
  "auth/checkSession",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/session");
      return response.data.success;
    } catch (error) {
      console.error("Session check failed:", error);
      return thunkAPI.rejectWithValue(false);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/allUsers");
      return response.data;
    } catch (error) {
      console.error("Fetch users failed:", error);
      return thunkAPI.rejectWithValue([]);
    }
  }
);
export const deleteUser = createAsyncThunk(
  "Users/deleteUser",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/deleteUser", { id });
      return response.data;
    } catch (error) {
      console.error("Delete user failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);
export const activateUser = createAsyncThunk(
  "Users/activateUser",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/activateUser", { id });
      return response.data;
    } catch (error) {
      console.error("Activate user failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);
export const deactivateUser = createAsyncThunk(
  "Users/deactivateUser",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/deactivateUser", { id });
      return response.data;
    } catch (error) {
      console.error("Deactivate user failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);
export const addUsers = createAsyncThunk(
  "Users/addUsers",
  async (values, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/addUser", values);
      return response.data;
    } catch (error) {
      console.error("Add user failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);

// Initial state
const initialState = {
  selectedUser: null,
  userModalVisible: false,
  adduserModalVisible: false,
  usersData: [],
  file: null,
};

// Slice
const authSlice = createSlice({
  name: "Users",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setUserModalVisible: (state, action) => {
      state.userModalVisible = action.payload;
    },
    setadduserModalVisible: (state, action) => {
      state.adduserModalVisible = action.payload;
    },
    setFile: (state, action) => {
      state.file = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.usersData = [];
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersData = Array.isArray(action.payload) ? action.payload : [];
    })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersData = [];
      });
  },
});

export const { setSelectedUser, setUserModalVisible, setFile ,setadduserModalVisible} = authSlice.actions;
export default authSlice.reducer;
