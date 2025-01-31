import React, { useState } from "react";
import "../../Styles/Sign.css";
import { useSelector, useDispatch } from "react-redux";
import {
  handleLogin,
  setpasswordChangedModalVisible,
  checkSession,
} from "../../Store/authSlice";
import FormChangePassword from "./ChangePassword.jsx";
import { Form, Input, Button, message } from "antd";

const SignIn = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (values) => {
    const { username, password } = values;
    const response = await dispatch(handleLogin({ username, password }));
    if (response.payload.success) {
      message.success("Logged in successfully");
      dispatch(checkSession());
    } else {
      message.error(response.payload.message);
    }
  };

  const openChangePassword = () => {
    dispatch(setpasswordChangedModalVisible(true));
  };

  return (
    <div children="Sign-In">
      <div className="form-container sign-in-container">
        <Form
          name="sign_in"
          layout="vertical"
          onFinish={handleSubmit}
          style={{ width: "100%", maxWidth: "400px", margin: "auto" }}
        >
          <h1>Sign in</h1>

          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <a
            href="#"
            onClick={openChangePassword}
            style={{ display: "block", marginBottom: "1rem" }}
          >
            Forgot your password?
          </a>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
      <FormChangePassword />
    </div>
  );
};

export default SignIn;
