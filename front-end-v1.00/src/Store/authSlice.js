import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";

export const checkSession = createAsyncThunk(
  "auth/checkSession",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("auth/session");
      return response.data.success;
    } catch (error) {
      console.error("Session check failed:", error);
      return thunkAPI.rejectWithValue(false);
    }
  }
);

export const handleLogout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.get("auth/logout");
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return thunkAPI.rejectWithValue(false);
    }
  }
);

export const addUser = createAsyncThunk(
  "auth/addUser",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/addUser", data);
      return response.data;
    } catch (error) {
      console.error("Add user failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const fetchSignedUser = createAsyncThunk(
  "auth/fetchSignedUser",
  async (_, thunkAPI) => {
    try {
      // console.log("Fetching signed user...");
      const response = await axiosInstance.get("/employees/signedUser");
      // console.log("fetchSignedUser response:", response);
      return response.data;
    } catch (error) {
      // console.error("Fetch user failed:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // console.error("Response data:", error.response.data);
        // console.error("Response status:", error.response.status);
        // console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request
        // console.error("Error setting up request:", error.message);
      }
      return thunkAPI.rejectWithValue(error.response?.data || null);
    }
  }
);

export const handleLogin = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("auth/login", data);
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("auth/changepassword", data);
      return response.data;
    } catch (error) {
      console.error("Change password failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);

// Initial state
const initialState = {
  isLoggedIn: false,
  loading: true,
  SignedUser: null,
  userAccess: null,
  passwordChangedModalVisible: false,
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setpasswordChangedModalVisible: (state, action) => {
      state.passwordChangedModalVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSignedUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSignedUser.fulfilled, (state, action) => {
        state.SignedUser = action.payload.user;
        state.userAccess = action.payload.access;
        state.loading = false;
      })
      .addCase(fetchSignedUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
        state.loading = false;
      })
      .addCase(checkSession.rejected, (state) => {
        state.isLoggedIn = false;
        state.loading = false;
      })

      .addCase(handleLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleLogout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.loading = false;
      })
      .addCase(handleLogout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(handleLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.success;
        state.loading = false;
      })
      .addCase(handleLogin.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setpasswordChangedModalVisible, setLoggedIn, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
