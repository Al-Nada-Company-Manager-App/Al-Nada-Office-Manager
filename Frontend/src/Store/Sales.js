import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";

export const fetchSales = createAsyncThunk("Sales/fetchSales", async () => {
  try {
    const response = await axiosInstance.get("/allSales");
    return response.data;
  } catch (error) {
    console.error("Error fetching sales:", error);
  }
});
export const deleteSale = createAsyncThunk("Sales/deleteSale", async (id) => {
  try {
    const response = await axiosInstance.post("/deleteSale", { id });
    return response.data;
  } catch (error) {
    console.error("Error deleting sale:", error);
  }
});
export const addSale = createAsyncThunk("Sales/addSale", async (values) => {
  try {
    const response = await axiosInstance.post("/addSale", values);
    fetchSales();
    return response.data;
  } catch (error) {
    console.error("Error adding sale:", error);
  }
});

// Initial state
const initialState = {
  selectedSale: null,
  SaleModalVisible: false,
  addSaleModalVisible: false,
  salesData: [],
  saleType: "",
  Total: 0,
  salesLoading: false,
};

// Slice
const saleSlice = createSlice({
  name: "Sales",
  initialState,
  reducers: {
    setSelectedSale: (state, action) => {
      state.selectedSale = action.payload;
    },
    setSaleModalVisible: (state, action) => {
      state.SaleModalVisible = action.payload;
    },
    setaddSaleModalVisible: (state, action) => {
      state.addSaleModalVisible = action.payload;
    },
    setSaleType: (state, action) => {
        state.saleType = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.salesLoading = true;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.salesData = action.payload;
        state.salesLoading = false;
      })
      .addCase(fetchSales.rejected, (state) => {
        state.salesLoading = false;
      });
  },
});

export const { setSaleType,setaddSaleModalVisible,setSelectedProducts,setSelectedCustomer,setSelectedSale, setSaleModalVisible } = saleSlice.actions;
export default saleSlice.reducer;
