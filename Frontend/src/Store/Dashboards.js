// Dashboards.js (Redux slice)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../Utils/axiosInstance";

const initialState = {
  // Summary totals
  totalStock: 0,
  totalPurchase: 0,
  totalSales: 0,
  totalDebts: 0,

  // Customers/Suppliers
  totalCustomers: 0,
  totalSuppliers: 0,
  topPayingCustomers: [],
  topRepairedProducts: [],
  productsInStock: 0,
  topSoldProducts: [],

  // Sales/Marketing
  salesBarData: [],
  marketingBarData: [],
  totalMarketing: 0,
  salesTotalFromChart: 0,
  bestCustomers: [],

  // Repairs/Inventory
  totalRepairs: 0,
  totalDUM: 0,
  totalSpareParts: 0,
  totalPending: 0,

  //CustomerProductChart
  customerProductData: [],

  //DebtsoverviewDate
  debtsData: [],

  //PurchaseOverviewData
  purchasesData: [],

  //RepairsOverTimeData
  repairsOverTimeData: [],

  //RepairStatusData
  repairStatusData: [],

  //SalesOverviewData
  salesOverviewData: [],

  //SparesChart
  sparesData: [],

  //SpaareslowData
  sparesLowData: [],

  //StockOverviewData
  stockOverviewData: [],

  //SupplierOverviewData
  supplierOverviewData: [],

  //topProductsData
  topProductsData: [],

  // Status
  loading: false,
  error: null,
};

// Thunks
export const fetchSummaryTotals = createAsyncThunk(
  "dashboards/fetchSummaryTotals",
  async (_, { rejectWithValue }) => {
    try {
      const [stock, purchase, sales, debts] = await Promise.all([
        axiosInstance.get("/dashboard/total-stock"),
        axiosInstance.get("/dashboard/total-purchase"),
        axiosInstance.get("/dashboard/total-sales"),
        axiosInstance.get("/dashboard/total-debts"),
      ]);

      return {
        totalStock: stock.data,
        totalPurchase: purchase.data,
        totalSales: sales.data,
        totalDebts: debts.data,
      };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchRepairTotals = createAsyncThunk(
  "dashboards/fetchRepairTotals",
  async (_, { rejectWithValue }) => {
    try {
      const [repairs, dum, spare, pending] = await Promise.all([
        axiosInstance.get("/dashboard/total-repairs"),
        axiosInstance.get("/dashboard/total-DUM"),
        axiosInstance.get("/dashboard/total-spare-parts"),
        axiosInstance.get("/dashboard/total-pending"),
      ]);

      return {
        totalRepairs: repairs.data.totalRepairs,
        totalDUM: dum.data.totalDUM,
        totalSpareParts: spare.data.totalSpare,
        totalPending: pending.data.totalpending,
      };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchCustomerSupplierData = createAsyncThunk(
  "dashboards/fetchCustomerSupplierData",
  async (_, { rejectWithValue }) => {
    try {
      const [customers, suppliers, topCustomers, repaired, products, sold] =
        await Promise.all([
          axiosInstance.get("/dashboard/getcustomerscount"),
          axiosInstance.get("/dashboard/getsupplierscount"),
          axiosInstance.get("/dashboard/gettopcustomers"),
          axiosInstance.get("/dashboard/gettoprepairedproducts"),
          axiosInstance.get("/dashboard/getproductscount"),
          axiosInstance.get("/dashboard/gettopsoldproducts"),
        ]);

      return {
        totalCustomers: customers.data.count,
        totalSuppliers: suppliers.data.count,
        topPayingCustomers: topCustomers.data.map((item) => ({
          type: item.c_name,
          value: Number(item.total_paid),
        })),
        topRepairedProducts: repaired.data.map((item) => ({
          type: item.p_name,
          value: Number(item.repair_count),
        })),
        productsInStock: products.data.count,
        topSoldProducts: sold.data.map((item) => ({
          type: item.p_name,
          value: Number(item.sales_count),
        })),
      };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchSalesMarketingData = createAsyncThunk(
  "dashboards/fetchSalesMarketingData",
  async (_, { rejectWithValue }) => {
    try {
      const [salesRes, marketingRes] = await Promise.all([
        axiosInstance.get("/dashboard/getcustomersales"),
        axiosInstance.get("/dashboard/getcustomermarkets"),
      ]);

      const salesData = salesRes.data.map((item) => ({
        type: item.c_name,
        value: Number(item.salescount),
      }));

      const marketingData = marketingRes.data.map((item) => ({
        type: item.c_name,
        value: Number(item.marketing_count),
      }));

      const bestCustomers = salesData
        .map((salesItem) => {
          const marketingItem = marketingData.find(
            (m) => m.type === salesItem.type
          );
          return {
            type: salesItem.type,
            sales: salesItem.value,
            marketing: marketingItem?.value || 0,
            difference: Math.abs(salesItem.value - (marketingItem?.value || 0)),
          };
        })
        .sort((a, b) => b.difference - a.difference)
        .slice(0, 5);

      return {
        salesBarData: salesData.sort((a, b) => b.value - a.value).slice(0, 10),
        marketingBarData: marketingData
          .sort((a, b) => a.value - b.value)
          .slice(0, 10),
        salesTotalFromChart: salesData.reduce((acc, cur) => acc + cur.value, 0),
        totalMarketing: marketingData.reduce((acc, cur) => acc + cur.value, 0),
        bestCustomers,
      };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchCustomerProductData = createAsyncThunk(
  "dashboards/CustomerProductData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/customersproducts");
      const formattedData = res.data.map((item) => ({
        type: item.customername,
        value: item.productcount,
      }));
      return formattedData;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchDebtOverviewDate = createAsyncThunk(
  "dashboards/DebtDate",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/debtsoverview");
      const processedData = (res.data || []).map((item) => {
        if (["DEBT_IN", "INSURANCE"].includes(item.d_type)) {
          return { ...item, total_debt: Math.abs(item.total_debt) };
        }
        return item;
      });
      return processedData;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchPurchaseOverviewData = createAsyncThunk(
  "dashboards/PurchaseOverviewData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/purchasesoverview");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchRepairsOverTime = createAsyncThunk(
  "dashboards/fetchRepairsOverTime",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/repairs-over-time");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchRepairStatusData = createAsyncThunk(
  "dashboards/fetchRepairStatusData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/repair-status");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchSalesOverviewData = createAsyncThunk(
  "dashboards/fetchSalesOverviewData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/salesoverview");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchSparePartsData = createAsyncThunk(
  "dashboards/fetchSparePartsData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/spare-parts-used");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchSparePartsLowStock = createAsyncThunk(
  "dashboards/fetchSparePartsLowStock",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/low-stock-alert");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchStockCategoryData = createAsyncThunk(
  "dashboards/fetchStockCategoryData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/stocks_summary");
      const formattedData = res.data.map((item) => ({
        type: item.p_category,
        value: item.total_quantity,
      }));
      return formattedData;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchSupplierProductData = createAsyncThunk(
  "dashboards/SupplierProductData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/suppliersproducts");
      const formattedData = res.data.map((item) => ({
        type: item.suppliername,
        value: item.productcount,
      }));
      return formattedData;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchTopProductsData = createAsyncThunk(
  "dashboards/fetchTopProductsData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/topproducts");
      const formattedData = res.data.map((item) => ({
        type: item.p_name,
        value: item.total_sale,
      }));
      return formattedData;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchSummaryTotals.fulfilled, (state, action) => {
      state.totalStock = action.payload.totalStock;
        state.totalPurchase = action.payload.totalPurchase;
        state.totalSales = action.payload.totalSales;
        state.totalDebts = action.payload.totalDebts;
        state.loading = false;
      })
      .addCase(fetchRepairTotals.fulfilled, (state, action) => {
        state.totalRepairs = action.payload.totalRepairs;
        state.totalDUM = action.payload.totalDUM;
        state.totalSpareParts = action.payload.totalSpareParts;
        state.totalPending = action.payload.totalPending;
        state.loading = false;
      })
      .addCase(fetchCustomerSupplierData.fulfilled, (state, action) => {
        state.totalCustomers = action.payload.totalCustomers;
        state.totalSuppliers = action.payload.totalSuppliers;
        state.topPayingCustomers = action.payload.topPayingCustomers;
        
        state.topRepairedProducts = action.payload.topRepairedProducts;
        state.productsInStock = action.payload.productsInStock;
        state.topSoldProducts = action.payload.topSoldProducts;
        state.loading = false;
      })
      .addCase(fetchSalesMarketingData.fulfilled, (state, action) => {
        state.salesBarData = action.payload.salesBarData;
        state.marketingBarData = action.payload.marketingBarData;
        state.salesTotalFromChart = action.payload.salesTotalFromChart;
        state.totalMarketing = action.payload.totalMarketing;
        state.bestCustomers = action.payload.bestCustomers;
        state.loading = false;
      })
      .addCase(fetchDebtOverviewDate.fulfilled, (state, action) => {
        state.debtsData = action.payload;
        state.loading = false;
      })
      .addCase(fetchPurchaseOverviewData.fulfilled, (state, action) => {
        state.purchasesData = action.payload;
        state.loading = false;
      })
      .addCase(fetchRepairsOverTime.fulfilled, (state, action) => {
        state.repairsOverTimeData = action.payload;
        state.loading = false;
      })
      .addCase(fetchRepairStatusData.fulfilled, (state, action) => {
        state.repairStatusData = action.payload;
        state.loading = false;
      })
      .addCase(fetchSalesOverviewData.fulfilled, (state, action) => {
        state.salesOverviewData = action.payload;
        state.loading = false;
      })
      .addCase(fetchSparePartsData.fulfilled, (state, action) => {
        state.sparesData = action.payload;
        state.loading = false;
      })
      .addCase(fetchSparePartsLowStock.fulfilled, (state, action) => {
        state.sparesLowData = action.payload;
        state.loading = false;
      })
      .addCase(fetchStockCategoryData.fulfilled, (state, action) => {
        state.stockOverviewData = action.payload;
        state.loading = false;
      })
      .addCase(fetchSupplierProductData.fulfilled, (state, action) => {
        state.supplierOverviewData = action.payload;
        state.loading = false;
      })
      .addCase(fetchTopProductsData.fulfilled, (state, action) => {
        state.topProductsData = action.payload;
        state.loading = false;
      })
      .addCase(fetchCustomerProductData.fulfilled, (state, action) => {
        state.customerProductData = action.payload;
        state.loading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        }
      );

  },
});

export default dashboardSlice.reducer;
