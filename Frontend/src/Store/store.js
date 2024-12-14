import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import homeMenuReducer from "./homeMenu";
import Users from "./Users";
import Notification from "./Notification";
import Sales from "./Sales";
import Customers from "./Customer";
import Products from "./Product";
import Purchases from "./Purchase"
const store = configureStore({
  reducer: {
    auth: authReducer,
    homeMenu: homeMenuReducer,
    Users: Users,
    Notification: Notification,
    Sales: Sales,
    Customers: Customers,
    Products: Products,
    Purchases: Purchases,
  },
});

export default store;
