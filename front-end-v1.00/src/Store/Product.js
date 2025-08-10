import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";

export const fetchProducts = createAsyncThunk(
  "Products/fetchProducts",
  async () => {
    try {
      const response = await axiosInstance.get("products");
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
);
export const handleAddProduct = createAsyncThunk(
  "Products/handleAddProduct",
  async (product) => {
    try {
      const response = await axiosInstance.post("products/AddProduct", product);
      return response.data;
    } catch (error) {
      console.error("Error adding product:", error);
    }
  }
);
export const updatesproductphoto = createAsyncThunk(
  "Products/updatesproductphoto",
  async (product) => {

    try {
      await axiosInstance.post("products/updatesproductphoto", product, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error updating product photo:", error);
    }
  }
);
export const updateProduct = createAsyncThunk(
  "Products/handleUpdateProduct",
  async (product) => {
    try {
      const response = await axiosInstance.post("products/updateProduct", product);
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }
);
export const handleDeleteProduct = createAsyncThunk(
  "Products/handleDeleteProduct",
  async (id) => {
    try {
      const res = await axiosInstance.post("products/delete", { id });
      return res.data;
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
  selectedProduct: null,
  filteredProducts: [],
  selectedProductModalVisible: false,
  detailProductModalVisible: false,
  addProductModalVisible: false,
  updateProductModalVisible: false,
  productLoading: false,
  file: null,
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
      state.selectedProduct = action.payload;
    },
    setEditedSelectedProduct: (state, action) => {
      state.editedSelectedProduct = action.payload;
    },
    setaddProductModalVisible: (state, action) => {
      state.addProductModalVisible = action.payload;
    },
    setFile: (state, action) => {
      state.file = action.payload;
    },
    setupdateProductModalVisible: (state, action) => {
      state.updateProductModalVisible = action.payload;
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
  setaddProductModalVisible,
  setFile,
  setupdateProductModalVisible,
} = productSlice.actions;
export default productSlice.reducer;
