import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import axiosInstance from "../Utils/axiosInstance";

export const fetchSales = createAsyncThunk("Sales/fetchSales", async () => {
  try {
    const response = await axiosInstance.get("/sales/");
    return response.data;
  } catch (error) {
    console.error("Error fetching sales:", error);
  }
});
export const deleteSale = createAsyncThunk("Sales/deleteSale", async (id) => {
  try {
    const response = await axiosInstance.delete(`/sales/${id}`);
    message.success("Sale deleted successfully");
    return response.data;
  } catch (error) {
    message.error("Error deleting sale");
    console.error("Error deleting sale:", error);
  }
});
export const addSale = createAsyncThunk("Sales/addSale", async (values) => {
  try {
    const response = await axiosInstance.post("/sales/", values);
    message.success("Sale added successfully");
    return response.data;
  } catch (error) {
    message.error("Error adding sale");
    console.error("Error adding sale:", error);
  }
});
export const updateSale = createAsyncThunk(
  "Sales/updateSale",
  async (values) => {
    try {
      console.log(values);
      const response = await axiosInstance.put(`/sales/${values.SL_ID}`, values);
      message.success("Sale updated successfully");
      return response.data;
    } catch (error) {
      message.error("Error updating sale");
      console.error("Error updating sale:", error);
    }
  }
);
export const fetchProductsinSale = createAsyncThunk(
  "Sales/fetchProductsInSale",
  async ({ saleId, saleType }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/sales/${saleId}/products/${saleType}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching products in sale:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch products"
      );
    }
  }
);

// Initial state
const initialState = {
  selectedSale: null,
  updateSale: null,
  productSaleData: [],
  SaleModalVisible: false,
  addSaleModalVisible: false,
  selectedSalesModalVisible: false,
  updateSaleModalVisible: false,
  addedDum: {},
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
      state.saleType = action.payload;
    },
    setselectedSalesModalVisible: (state, action) => {
      state.selectedSalesModalVisible = action.payload;
    },
    setupdateSaleModalVisible: (state, action) => {
      state.updateSaleModalVisible = action.payload;
    },
    updateSale: (state, action) => {
      state.updateSale = action.payload;
    },
    addtodum: (state, action) => {
      state.addedDum = {
        ...state.addedDum,
        [action.payload]: action.payload,
      };
    },

    clearaddedDum: (state) => {
      state.addedDum = {};
    },
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
    builder.addCase(deleteSale.fulfilled, (state) => {
      state.salesLoading = false;
    });
    builder.addCase(fetchProductsinSale.fulfilled, (state, action) => {
      state.productSaleData = action.payload;
    });
  },
});

export const {
  addtodum,
  clearaddedDum,
  setupdateSaleModalVisible,
  setselectedSalesModalVisible,
  setSaleType,
  setaddSaleModalVisible,
  setSelectedProducts,
  setSelectedCustomer,
  setSelectedSale,
  setSaleModalVisible,
} = saleSlice.actions;
export default saleSlice.reducer;
