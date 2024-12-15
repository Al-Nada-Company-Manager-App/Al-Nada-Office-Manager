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

export const handleLogout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.get("/logout");
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return thunkAPI.rejectWithValue(false);
    }
  }
);

export const fetchSignedUser = createAsyncThunk(
  "auth/fetchSignedUser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/SignedUser");
      return response.data;
    } catch (error) {
      console.error("Fetch user failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);


// Initial state
const initialState = {
  isLoggedIn: false,
  loading: true,
  SignedUser: null,
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSignedUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSignedUser.fulfilled, (state, action) => {
        state.SignedUser = action.payload;
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
      });
  },
});

export const { setpasswordChangedModalVisible, setLoggedIn, setLoading } = authSlice.actions;
export default authSlice.reducer;
