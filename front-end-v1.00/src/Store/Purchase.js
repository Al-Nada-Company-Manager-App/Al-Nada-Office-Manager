import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";

export const fetchPurchases = createAsyncThunk("Purchase/fetchPurchases", async () => {
  try {
    const response = await axiosInstance.get("/purchases/");
    return response.data;
  } catch (error) {
    console.error("Error fetching Purchases:", error);
  }
});
export const deletePurchase = createAsyncThunk("Purchase/deletePurchase", async (id) => {
  try {
    const response = await axiosInstance.post("/purchases/delete", { id });
    return response.data;
  } catch (error) {
    console.error("Error deleting Purchase:", error);
  }
});
export const addPurchase = createAsyncThunk("Purchase/addPurchase", async (values) => {
  try {
    const response = await axiosInstance.post("/addPch", values);
    return response.data;
  } catch (error) {
    console.error("Error adding Purchase:", error);
  }
});
export const updatePurchase = createAsyncThunk("Purchase/updatePurchase", async (values) => {
  try {
    const response = await axiosInstance.post("/updatePch", values);
    return response.data;
  } catch (error) {
    console.error("Error updating Purchase:", error);
  }
});

// Initial state
const initialState = {
  selectedpurchase: null,
  PurchaseModalVisible: false,
  addPurchaseModalVisible: false,
  updatePurchaseModalVisible: false,
  purchasesData: [],
  Total: 0,
  purchaseLoading: false,
};

// Slice
const purchaSlice = createSlice({
  name: "Purchase",
  initialState,
  reducers: {
    setSelectedPurchase: (state, action) => {
      state.selectedpurchase = action.payload;
    },
    setPurchaseModalVisible: (state, action) => {
      state.PurchaseModalVisible = action.payload;
    },
    setaddPurchaseModalVisible: (state, action) => {
      state.addPurchaseModalVisible = action.payload;
    },
    setupdatePurchaseModalVisible: (state, action) => {
      state.updatePurchaseModalVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.purchaseLoading = true;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.purchasesData = action.payload;
        state.purchaseLoading = false;
      })
      .addCase(fetchPurchases.rejected, (state) => {
        state.purchaseLoading = false;
      });
  },
});

export const { 
    setSelectedPurchase, 
    setPurchaseModalVisible, 
    setaddPurchaseModalVisible,
    setupdatePurchaseModalVisible
    } = purchaSlice.actions;
export default purchaSlice.reducer;
