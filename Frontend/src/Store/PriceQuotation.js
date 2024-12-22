import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";

// Async thunk for fetching price quotations
export const fetchPriceQuotations = createAsyncThunk(
  "priceQuotations/fetchPriceQuotations",
  async () => {
    try {
      const response = await axiosInstance.get("/allPriceQuotation");
      return response.data;
    } catch (error) {
      console.error("Error fetching price quotations:", error);
    }}
);
export const deletePriceQuotation = createAsyncThunk("priceQuotations/deletepq", async (id) => {
  try {
    const response = await axiosInstance.post("/deletepq", { id });
    return response.data;
  } catch (error) {
    console.error("Error deleting price quotations:", error);
  }
});

export const addPriceQuotation = createAsyncThunk("priceQuotations/addpq", async (values) => {
  try {
    const response = await axiosInstance.post("/addpq", values);
    return response.data;
  } catch (error) {
    console.error("Error adding price qoutation:", error);
  }
});

const initialState= {
  pqData: [],
  pqLoading: false,
  addPQModalVisible: false,
  selectedPQ: null,
  pqDetailVisible: false,
};
const priceQuotationSlice = createSlice({
  name: "priceQuotations",
  initialState,
  reducers: {
    setpqDetailVisible(state, action) {
      state.pqDetailVisible = action.payload;
    },
    setAddPQModalVisible(state, action) {
      state.addPQModalVisible = action.payload;
    },
    setSelectedPQ(state, action) {
      state.selectedPQ = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriceQuotations.pending, (state) => {
        state.pqLoading = true;
      })
      .addCase(fetchPriceQuotations.fulfilled, (state, action) => {
        state.pqData = action.payload;
        state.pqLoading = false;
      })
      .addCase(fetchPriceQuotations.rejected, (state, action) => {
        state.pqLoading = false;
        console.error(action.error.message);
      });
  },
});

export const {
  setpqDetailVisible,
  setAddPQModalVisible,
  setSelectedPQ,
} = priceQuotationSlice.actions;

export default priceQuotationSlice.reducer;
