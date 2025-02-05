import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import homeMenuReducer from "./homeMenu";
import Users from "./Users";
import Notification from "./Notification";
import Sales from "./Sales";
import Customers from "./Customer";
import Products from "./Product";
import priceQuotations from "./PriceQuotation";
import Debts from "./Debts";
import Purchases from "./Purchase"
import Suppliers from "./Supplier";
import UserProfile from "./UserProfile";
import Dashboards from "./Dashboards";



const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/fetchUsers/fulfilled'], 
        ignoredPaths: ['Users.file'], 
      },
    }),
  reducer: {
    auth: authReducer,
    homeMenu: homeMenuReducer,
    Users: Users,
    Notification: Notification,
    Sales: Sales,
    Customers: Customers,
    Products: Products,
    PriceQuotations: priceQuotations,
    Debts: Debts,
    Purchases: Purchases,
    Suppliers: Suppliers,
    UserProfile: UserProfile,
    Dashboards: Dashboards,
  },
});

export default store;
