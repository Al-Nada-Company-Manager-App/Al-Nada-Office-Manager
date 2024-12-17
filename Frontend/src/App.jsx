import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { theme, ConfigProvider } from "antd";
import "./Styles/index.css";
import HomePage from "./component/HomePage.jsx";
import Sign from "./component/Signfeatures/SignForm.jsx";
import { checkSession,fetchSignedUser } from "./Store/authSlice.js";
import Loader from "./component/Loader.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkSession());    
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchSignedUser ());
  }, [isLoggedIn,dispatch])

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#0958d9",
            borderRadius: 2,
            colorBgContainer: "#fff",
            contentBg: "#f5f5f5",
          },
        }}
      >
        {isLoggedIn ? (
          <HomePage />
        ) : (
          <Sign onLoginSuccess={() => dispatch(checkSession())} />
        )}
      </ConfigProvider>
    </div>
  );
};

export default App;
