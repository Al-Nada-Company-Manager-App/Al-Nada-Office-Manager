import React, { useState } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setpasswordChangedModalVisible } from "../../Store/authSlice";

function FormChangePassword() {
  const dispatch = useDispatch();
  const { passwordChangedModalVisible } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const handleOpenModal = () => {
    dispatch(setpasswordChangedModalVisible(true));
  };

  const handleCancel = () => {
    dispatch(setpasswordChangedModalVisible(false));
  };

  const handleFinish = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/changepassword",
        {
          username: values.username,
          newPassword: values.newPassword1,
        }
      );

      dispatch(setpasswordChangedModalVisible(false));
      if (response.data.E_ROLE != "Manager") {
        const message =
          response.data.F_NAME +
          " " +
          response.data.L_NAME +
          " need to be activated after password change";
        const NotificationData = {
          n_message: message,
          n_type: "APPROVEUSER",
          n_E_ID: response.data.E_ID,
        };
        await axios.post(
          "http://localhost:4000/sendNotification",
          NotificationData,
          {
            withCredentials: true,
          }
        );
      }
      message.success(response.data.message);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 10,
      },
    },
    wrapperCol: {
      xs: {
        span: 12,
      },
    },
  };

  return (
    <>
      <Button type="primary" onClick={handleOpenModal}>
        Change Password
      </Button>
      <Modal
        title="Change Password"
        open={passwordChangedModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Submit
          </Button>,
        ]}
      >
        <Form
          {...formItemLayout}
          layout="horizontal"
          form={form}
          onFinish={handleFinish}
          style={{
            width: "100%",
            padding: "15px",
            margin: "auto",
            textAlign: "center",
          }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword1"
            rules={[
              {
                required: true,
                message: "Password must be at least 8 characters",
                min: 8,
              },
            ]}
          >
            <Input.Password placeholder="New Password" />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="newPassword2"
            dependencies={["newPassword1"]}
            rules={[
              {
                required: true,
                message: "Please confirm your new password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword1") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two new passwords must match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Re-Enter New Password" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default FormChangePassword;
