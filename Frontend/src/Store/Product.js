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
export const handleDeleteProduct = createAsyncThunk(
  "Products/handleDeleteProduct",
  async (id) => {
    try {
      await axiosInstance.post("/DeleteProduct", {id});
      return id;
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
);

// Initial state
const initialState = {
  productsData: [],
  selectedProducts: [],
  editedSelectedProduct: null,
  selectedProduct:null,
  filteredProducts: [],
  selectedProductModalVisible: false,
  detailProductModalVisible: false,
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
    setdetailProductModalVisible: (state, action) => {
      state.detailProductModalVisible = action.payload;
    },
    setSelecteditem: (state, action) => {
      state.selectedProduct = action.payload
    },
    setEditedSelectedProduct: (state, action) => {
      state.editedSelectedProduct = action.payload;
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
  setdetailProductModalVisible,
  setSelecteditem,
  setEditedSelectedProduct,

} = productSlice.actions;
export default productSlice.reducer;
