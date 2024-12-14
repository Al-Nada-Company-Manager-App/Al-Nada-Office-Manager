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
  async (customerId) => {
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
      const response = await axiosInstance.post("/addSupplier", supplier);
      return response.data;
    } catch (error) {
      console.error("Error adding supplier:", error);
    }
  }
);
export const handleDeleteSupplier = createAsyncThunk( 
  "Suppliers/handleDeleteSupplier",
  async (id) => {
    try {
      const response = await axiosInstance.post ("/deletesupplier", {id});
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
    setCustomerModalVisible: (state, action) => {
      state.customerModalVisible = action.payload;
    },
    setaddCustomerModalVisible: (state, action) => {
      state.addcustomerModalVisible = action.payload;
    },
    setFile: (state, action) => {
      state.file = action.payload;
    },
    setupdateCustomerModalVisible: (state, action) => {
      state.updatecustomerModalVisible = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.CustomersLoading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customersData = action.payload;
        state.CustomersLoading = false;
      })
      .addCase(fetchCustomers.rejected, (state) => {
        state.CustomersLoading = false;
      });
    builder
      .addCase(fetchSalesHistory.pending, (state) => {
        state.SalesLoading = true;
      })
      .addCase(fetchSalesHistory.fulfilled, (state, action) => {
        state.customerSalesData = action.payload;
        state.SalesLoading = false;
      })
      .addCase(fetchSalesHistory.rejected, (state) => {
        state.SalesLoading = false;
      });
    builder
      .addCase(addCustomer.pending, (state) => {
        state.CustomersLoading = true;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.customersData.push(action.payload);
        state.CustomersLoading = false;
      })
      .addCase(addCustomer.rejected, (state) => {
        state.CustomersLoading = false;
      });
    builder
      .addCase(handleDeleteCustomer.pending, (state) => {
        state.CustomersLoading = true;
      })
      .addCase(handleDeleteCustomer.fulfilled, (state, action) => {
        state.customersData = state.customersData.filter(
          (customer) => customer.c_id !== action.payload
        );
        state.CustomersLoading = false;
      })
      .addCase(handleDeleteCustomer.rejected, (state) => {
        state.CustomersLoading = false;
      });
    builder
      .addCase(updateCustomer.pending, (state) => {
        state.CustomersLoading = true;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.customersData = state.customersData.map((customer) =>
          customer.c_id === action.payload.c_id ? action.payload : customer
        );
        state.CustomersLoading = false;
      })
      .addCase(updateCustomer.rejected, (state) => {
        state.CustomersLoading = false;
      });
  },
});

export const {
  setCustomerModalVisible,
  setSelectedCustomer,
  setSelectedCustomerModalVisible,
  setaddCustomerModalVisible,
  setupdateCustomerModalVisible,
} = supplierSlice.actions;
export default supplierSlice.reducer;
