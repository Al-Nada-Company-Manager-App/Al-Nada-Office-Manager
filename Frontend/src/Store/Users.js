import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";
import { approveNotification } from "./Notification";

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
export const getAccessRules = createAsyncThunk(
  "Users/getAccessRules",
  async (id, thunkAPI) => {
    try {
      console.log(id);  
      const response = await axiosInstance.get("/getUserAccess", { params: { id } }); 
      return response.data;
    } catch (error) {
      console.error("Get access rules failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);
export const updateAccessRules = createAsyncThunk(
  "Users/updateAccessRules",
  async (values, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/updateUserAccess", values);
      return response.data;
    } catch (error) {
      console.error("Update access rules failed:", error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);


// Initial state
const initialState = {
  selectedUser: null,
  selectedUserAccess: null,
  userModalVisible: false,
  adduserModalVisible: false,
  editaccessModalVisible: false,
  approvedUsers: [],
  usersData: [],
  file: null,
  userLoading: false,
};

// Slice
const userSlice = createSlice({
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
    seteditaccessModalVisible: (state, action) => {
      state.editaccessModalVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.usersData = [];
        state.approvedUsers = [];
        state.userLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersData = Array.isArray(action.payload) ? action.payload : [];
        state.approvedUsers = state.usersData.filter(
          (user) => user.e_active === false
        );
        state.userLoading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersData = [];
        state.approvedUsers = [];
        state.userLoading = false;
      });

    builder.addCase(approveNotification.fulfilled, (state, action) => {
      state.selectedUser = action.payload;
      console.log;
    });
    builder.addCase(getAccessRules.fulfilled, (state, action) => {
      state.selectedUserAccess = action
        ? action.payload
        : null;
    }
    );
  },
});

export const {
  setSelectedUser,
  setUserModalVisible,
  setFile,
  setadduserModalVisible,
  seteditaccessModalVisible,
} = userSlice.actions;
export default userSlice.reducer;
