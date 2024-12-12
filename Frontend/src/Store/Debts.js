import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";

export const fetchDebts = createAsyncThunk("Debts/fetchDebts", async () => {
  try {
    const response = await axiosInstance.get("/allDebts");
    return response.data;
  } catch (error) {
    console.error("Error fetching sales:", error);
  }
});
export const addDebt = createAsyncThunk("Debts/addDebt", async (debt) => {
  try {
    const response = await axiosInstance.post("/addDebt", debt);
    return response.data;
  } catch (error) {
    console.error("Error adding debt:", error);
  }
});

// Initial state
const initialState = {
  selectedDebt: null,
  DebtModalVisible: false,
  addDebtModalVisible: false,
  debtData: [],
  debtsLoading: false,
};

// Slice
const debtSlice = createSlice({
  name: "Debts",
  initialState,
  reducers: {
    setselectedDebt: (state, action) => {
      state.selectedDebt = action.payload;
    },
    setDebtModalVisible: (state, action) => {
      state.DebtModalVisible = action.payload;
    },
    setaddDebtModalVisible: (state, action) => {
      state.addDebtModalVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDebts.pending, (state) => {
        state.debtsLoading = true;
      })
      .addCase(fetchDebts.fulfilled, (state, action) => {
        state.debtData = action.payload;
        state.debtsLoading = false;
      })
      .addCase(fetchDebts.rejected, (state) => {
        state.debtsLoading = false;
      });
    builder
      .addCase(addDebt.pending, (state) => {
        state.debtsLoading = true;
      })
      .addCase(addDebt.fulfilled, (state) => {
        state.debtsLoading = false;
      })
      .addCase(addDebt.rejected, (state) => {
        state.debtsLoading = false;
      });
  },
});

export const { setaddDebtModalVisible, setselectedDebt, setDebtModalVisible } =
  debtSlice.actions;
export default debtSlice.reducer;
