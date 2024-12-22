import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/axiosInstance";
import { message, notification } from 'antd';

export const fetchCustomers = createAsyncThunk(
  "Customers/fetchCustomers",
  async () => {
    try {
      const response = await axiosInstance.get("/allcustomers");
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }
);
export const fetchSalesHistory = createAsyncThunk(
  "Customers/fetchSalesHistory",
  async (customerId) => {
    try {
      const response = await axiosInstance.get(
        `/getCustomerSales/${customerId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching sales history:", error);
    }
  }
);

export const addCustomer = createAsyncThunk(
  "Customers/addCustomer",
  async (customer) => {
    try {
      const response = await axiosInstance.post("/addcustomer", customer);
      message.success("Customer added successfully");
      return response.data;
    } catch (error) {
      console.error("Error adding customer:", error);
      message.error("Error adding customer");
    }
  }
);
export const updateCustomerPhoto = createAsyncThunk(
  "Customers/updateCustomerPhoto",
  async (customer) => {
    try {
      const response = await axiosInstance.post("/updatecustomerphoto", customer
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
export const handleDeleteCustomer = createAsyncThunk(
  "Customers/handleDeleteCustomer",
  async (id) => {
    try {
      const response = await axiosInstance.post ("/deletecustomer", {id});
      message.success("Customer deleted successfully");
      return response.data;
    } catch (error) {
      console.error("Error deleting customer:", error);
      message.error("Error deleting customer");
    }
  }
);
export const updateCustomer = createAsyncThunk(
  "Customers/updateCustomer",
  async (customer) => {
    try {
      const response = await axiosInstance.post("/updatecustomer", customer);
      message.success("Customer updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
      message.error("Error updating customer");
    }
  }
);

export const addMarkiting = (data) => async (dispatch) => {
  try {
      const response = await axiosInstance.post('/addMarketing', data);  // Post data to the server

      message.success('Marketing added successfully');
      
  } catch (error) {
      dispatch({
          type: 'ADD_MARKETING_FAILURE',
          payload: 'Error adding marketing',
      });
      message.error('Error adding marketing');
  }
};
export const deleteAllMarkitings = () => async (dispatch) => {
  try {
      const response = await axiosInstance.post('/deleteAllMarkitings');  // Post data to the server

      message.success('Marketings deleted successfully');
      
  } catch (error) {
      dispatch({
          type: 'DELETE_MARKITINGS_FAILURE',
          payload: 'Error deleting marketings',
      });
      message.error('Error deleting marketings');
  }
};
// Initial state
const initialState = {
  customersData: [],
  customerSalesData: [],
  selectedCustomer: null,
  SalesLoading: false,
  CustomersLoading: false,
  selectCustomerModalVisible: false,
  customerModalVisible: false,
  addcustomerModalVisible: false,
  updatecustomerModalVisible: false,
  file: null,
};

// Slice
const customerSlice = createSlice({
  name: "Customers",
  initialState,
  reducers: {
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    setSelectedCustomerModalVisible: (state, action) => {
      state.selectCustomerModalVisible = action.payload;
    },
    setCustomerModalVisible: (state, action) => {
      state.customerModalVisible = action.payload;
    },
    setaddCustomerModalVisible: (state, action) => {
      state.addcustomerModalVisible = action.payload;
    },
    setupdateCustomerModalVisible: (state, action) => {
      state.updatecustomerModalVisible = action.payload;
    },
    setFile: (state, action) => {
      state.file = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
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
  setFile,
} = customerSlice.actions;
export default customerSlice.reducer;
