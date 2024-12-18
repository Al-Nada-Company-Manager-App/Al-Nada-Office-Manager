import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";

export const fetchSuppliers = createAsyncThunk(
  "Suppliers/fetchSuppliers",
  async () => {
    try {
      const response = await axiosInstance.get("/allsuppliers");
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
        `/getSupplierPurchase/${supplierId}`
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
      console.log(supplier);
      const response = await axiosInstance.post("/addsupplier", supplier);
      return response.data;
    } catch (error) {
      console.error("Error adding supplier:", error);
    }
  }
);
export const updateSupplierPhoto = createAsyncThunk(
  "Suppliers/updateSupplierPhoto",
  async (supplier) => {
    try {
      const response = await axiosInstance.post("/updatesupplierphoto", supplier
        ,{
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customer photo:", error);
    }
  }
);
export const handleDeleteSupplier = createAsyncThunk( 
  "Suppliers/handleDeleteSupplier",
  async (id) => {
    try {
      const response = await axiosInstance.post ("/deleteSupplier", {id});
      return response.data;
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  }
);
export const updateSupplier = createAsyncThunk(
  "Suppliers/updateSupplier",
  async (supplier) => {
    try {
      const response = await axiosInstance.post("/updatesupplier", supplier);
      return response.data;
    } catch (error) {
      console.error("Error updating supplier:", error);
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
        state.supplierPurchasesData = action.payload;
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
