import React from "react";
import { Spin } from "antd";
import { useSelector } from "react-redux";

function Loader() {
  const { loading } = useSelector((state) => state.auth);
  const loaderStyle = {
    position: "fixed",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    opacity: 0.1,
    zIndex: 1,
    top: 0,
    left: 0,
  };

  const spinStyle = {
    zIndex: 2,
    position: "fixed",
    margin: "auto",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <>
      {loading && <div style={loaderStyle} />}
      {loading && <Spin tip="Loading..." size="large" style={spinStyle} />}
    </>
  );
}

export default Loader;
