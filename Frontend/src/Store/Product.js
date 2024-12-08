import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";

export const fetchProducts = createAsyncThunk(
  "Products/fetchProducts",
  async () => {
    try {
      const response = await axiosInstance.get("/AllProducts");
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
);

// Initial state
const initialState = {
  productsData: [],
  selectedProducts: [],
  filteredProducts: [],
  selectedProductModalVisible: false,
  productLoading: false,
};

// Slice
const productSlice = createSlice({
  name: "Products",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProducts = action.payload;
    },
    setSelectedProductModalVisible: (state, action) => {
      state.selectedProductModalVisible = action.payload;
    },
    setfilteredProducts: (state, action) => {
      state.filteredProducts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.productLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsData = action.payload;
        state.filteredProducts = action.payload;
        state.productLoading = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.productLoading = false;
      });
  },
});

export const {
  setfilteredProducts,
  setSelectedProduct,
  setSelectedProductModalVisible,
} = productSlice.actions;
export default productSlice.reducer;
