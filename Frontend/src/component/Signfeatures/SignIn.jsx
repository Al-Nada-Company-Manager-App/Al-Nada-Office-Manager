import React, { useState } from "react";
import axios from "axios";
import "../../Styles/Sign.css";
import { useDispatch } from "react-redux";
import { setpasswordChangedModalVisible } from "../../Store/authSlice";
import FormChangePassword from "./ChangePassword.jsx";
import { Form, Input, Button, message } from "antd";
import logo from "../../assets/logo.png";
import SignUpForm from "./SignUp";

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
  <div className="sign-in-page">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="form-card">
        <Form name="sign_in" layout="vertical" onFinish={handleSubmit} className="sign-in-form">
          <Form.Item
            name="username"
            label="Username"
            // rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            // rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit"  loading={loading} className="login-button">
              Log in
            </Button>
          </Form.Item>
          <div className="forgot-password">
            <a href="#" onClick={openChangePassword} style={{ color: "black", textDecoration: "underline" }}>Forget your password?</a>
          </div>
        </Form>
      <div className="signup-section">
          <div className="separator">
            <span className="text">New to our community</span>
          </div>
            <SignUpForm />
      </div>
          <FormChangePassword />
    </div>
  </div>
  );
};

export default SignIn;
