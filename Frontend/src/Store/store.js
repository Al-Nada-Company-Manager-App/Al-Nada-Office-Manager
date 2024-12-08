import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import homeMenuReducer from './homeMenu';
import Users from './Users'

const store = configureStore({
  reducer: {
    auth: authReducer,
    homeMenu: homeMenuReducer,
    Users: Users,
  },
});

export default store;
