import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./Store/store.js";
import App from "./App.jsx";
import './Styles/index.css';

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);


