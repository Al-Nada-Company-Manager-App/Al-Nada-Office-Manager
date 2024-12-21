import React, { useState } from "react";
import axios from "axios";
import "../../Styles/Sign.css";
import { useSelector, useDispatch } from "react-redux";
import { setpasswordChangedModalVisible } from "../../Store/authSlice";
import FormChangePassword from "./ChangePassword.jsx";
import { Form, Input, Button, message } from "antd";

const SignIn = ({ onLoginSuccess }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    const { username, password } = values;
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/login",
        { username, password },
        { withCredentials: true }
      );
      if (response.data.success) {
        message.success("Login successful!");
        onLoginSuccess();
      } else {
        message.error(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error("An error occurred during login.");
    } finally {
      setLoading(false);
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
