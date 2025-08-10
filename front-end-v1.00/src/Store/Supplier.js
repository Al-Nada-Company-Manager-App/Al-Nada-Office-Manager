import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";
import { message } from "antd";

export const fetchSuppliers = createAsyncThunk(
  "Suppliers/fetchSuppliers",
  async () => {
    try {
      const response = await axiosInstance.get("/suppliers");
      return response.data;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  }
);
export const fetchPurchaseHistory = createAsyncThunk(
  "Suppliers/fetchPurchaseHistory",
  async (supplierId) => {
    try {
      const response = await axiosInstance.get(
        `/suppliers/${supplierId}/purchases`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  }
);

export const addSupplier = createAsyncThunk(
  "Suppliers/addSupplier",
  async (supplier) => {
    try {
      const response = await axiosInstance.post("/suppliers", supplier);
      message.success("Supplier added successfully");
      return response.data;
    } catch (error) {
      console.error("Error adding supplier:", error);
      message.error("Error adding supplier");
    }
  }
);
export const updateSupplierPhoto = createAsyncThunk(
  "Suppliers/updateSupplierPhoto",
  async (formData) => {
    try {
      const response = await axiosInstance.put("/suppliers/updatesupplierphoto", formData
        ,{
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating supplier photo:", error);
    }
  }
);
export const handleDeleteSupplier = createAsyncThunk( 
  "Suppliers/handleDeleteSupplier",
  async (id) => {
    try {
      const response = await axiosInstance.delete(`/suppliers/${id}`);
      message.success("Supplier deleted successfully");
      return response.data;
    } catch (error) {
      console.error("Error deleting supplier:", error);
      message.error("Error deleting supplier");
    }
  }
);
export const updateSupplier = createAsyncThunk(
  "Suppliers/updateSupplier",
  async (supplier) => {
    try {
      const response = await axiosInstance.put(`/suppliers/${supplier.S_ID}`, supplier);
      message.success("Supplier updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating supplier:", error);
      message.error("Error updating supplier");
    }
  }
);

// Initial state
const initialState = {
  suppliersData: [],
  supplierPurchasesData: [],
  selectedSupplier: null,
  PurchaseLoading: false,
  SuppliersLoading: false,
  selectSupplierModalVisible: false,
  supplierModalVisible: false,
  addsupplierModalVisible: false,
  updatesupplierModalVisible: false,
  file: null,
};

// Slice
const supplierSlice = createSlice({
  name: "Suppliers",
  initialState,
  reducers: {
    setSelectedSupplier: (state, action) => {
      state.selectedSupplier = action.payload;
    },
    setSelectSupplierModalVisible: (state, action) => {
      state.selectSupplierModalVisible = action.payload;
    },
    setSupplierModalVisible: (state, action) => {
      state.supplierModalVisible = action.payload;
    },
    setaddSupplierModalVisible: (state, action) => {
      state.addsupplierModalVisible = action.payload;
    },
    setFile: (state, action) => {
      state.file = action.payload;
    },
    setupdateSupplierModalVisible: (state, action) => {
      state.updatesupplierModalVisible = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.SuppliersLoading = true;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.suppliersData = action.payload;
        state.SuppliersLoading = false;
      })
      .addCase(fetchSuppliers.rejected, (state) => {
        state.SuppliersLoading = false;
      });
    builder
      .addCase(fetchPurchaseHistory.pending, (state) => {
        state.PurchaseLoading = true;
      })
      .addCase(fetchPurchaseHistory.fulfilled, (state, action) => {
        state.supplierPurchasesData = action.payload.purchasesHistory;
        state.PurchaseLoading = false;
      })
      .addCase(fetchPurchaseHistory.rejected, (state) => {
        state.PurchaseLoading = false;
      });
  },
});

export const {
  setSupplierModalVisible,
  setSelectedSupplier,
  setSelectSupplierModalVisible,
  setaddSupplierModalVisible,
  setupdateSupplierModalVisible,
  setFile,
} = supplierSlice.actions;
export default supplierSlice.reducer;
