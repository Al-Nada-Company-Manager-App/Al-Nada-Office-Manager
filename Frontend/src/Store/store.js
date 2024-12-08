import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import homeMenuReducer from "./homeMenu";
import Users from "./Users";
import Notification from "./Notification";

const store = configureStore({
  reducer: {
    auth: authReducer,
    homeMenu: homeMenuReducer,
    Users: Users,
    Notification: Notification,
  },
});

export default store;
