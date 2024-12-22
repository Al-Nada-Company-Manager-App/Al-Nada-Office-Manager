import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";
import { message, notification } from 'antd';

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
export const getproductspq = createAsyncThunk(
  "priceQuotations/getproductspq",
  async (pq_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/getproductspq", {
        params: { pq_id }, // Pass pq_id as a query parameter
      });
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching products with price quotations:", error);
      return rejectWithValue("Failed to fetch products.");
    }
  }
);


export const deletePriceQuotation = createAsyncThunk("priceQuotations/deletepq", async (id) => {
  try {
    console.log("Deleting Price Quotation with ID:", id);
    const response = await axiosInstance.post("/deletepq", { id });
    message.success("Price Quotation deleted successfully");
    return response.data;
  } catch (error) {
    console.error("Error deleting price quotations:", error);
    message.error("Error deleting price quotation");
  }
});

export const addPriceQuotation = createAsyncThunk("priceQuotations/addpq", async (values) => {
  try {
    const response = await axiosInstance.post("/addpq", values);
    message.success("Price Quotation added successfully");
    return response.data;
  } catch (error) {
    console.error("Error adding price qoutation:", error);
    message.error("Error adding price quotation");
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
      builder .addCase(getproductspq.fulfilled, (state, action) => {
        state.products = action.payload;
      });
  },
});

export const {
  setpqDetailVisible,
  setAddPQModalVisible,
  setSelectedPQ,
} = priceQuotationSlice.actions;

export default priceQuotationSlice.reducer;
