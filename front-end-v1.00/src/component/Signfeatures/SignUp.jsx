import React from "react";
import "../../Styles/Sign.css";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Radio,
  Upload,
  Row,
  Col,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addUsers } from "../../Store/Users";
import { updateuserphoto } from "../../Store/UserProfile";
import { addNotification } from "../../Store/Notification";

function SignUpForm() {
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [isnewModalVisible, setIsnewModalVisible] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const handlenewModalClose = () => {
    setIsnewModalVisible(false);
  };
  const handlenewModalOpen = (e) => {
    e.preventDefault();
    setIsnewModalVisible(true);
  };
  const handleFinish = async (values) => {
    values.birth_date = values.birth_date
      ? values.birth_date.format("YYYY-MM-DD")
      : null;
    const userData = { ...values };

    const result = await dispatch(addUsers(userData));
    if (result.payload.success) {
      message.success("User added successfully");
      console.log(result);
      console.log(file);
      if (file) {
        const photoData = {};
        photoData.E_ID = result.payload.id;
        photoData.photo = file;
        dispatch(updateuserphoto(photoData));
      }
    } else {
      message.error("Error Happens");
    }
    const nmessage =
      result.payload.fName +
      " " +
      result.payload.lName +
      " need to be approved";
    const NotificationData = {
      n_message: nmessage,
      n_type: "APPROVEUSER",
      n_E_ID: result.payload.id,
    };
    await dispatch(addNotification(NotificationData));
  };
  const handleUploadChange = (info) => {
    if (info.fileList.length > 0) {
      const filee = info.fileList[0].originFileObj;
      setFile(filee);
    } else {
      setFile(null);
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handlenewModalOpen}>
        <h1>Create Account</h1>
        <button style={{ margin: "20px" }}>Sign Up</button>
      </form>
      <Modal
        title="Register"
        centered
        open={isnewModalVisible}
        onCancel={handlenewModalClose}
        footer={[
          <Button key="close" onClick={handlenewModalClose}>
            Close
          </Button>,
        ]}
        width={1000}
      >
        <Form
          layout="horizontal"
          className="employee-form"
          onFinish={(values) => {
            if (handleFinish(values)) {
              handlenewModalClose();
            }
          }}
        >
          <Row gutter={16}>
            {/* Left Column */}
            <Col span={12}>
              <Form.Item
                label="First Name"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                name="fName"
                rules={[{ required: true, message: "First name is required!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Last Name"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                name="lName"
                rules={[{ required: true, message: "Last name is required!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Gender"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                name="gender"
                rules={[{ required: true, message: "Gender is required!" }]}
              >
                <Radio.Group>
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="birth_date"
                label="Birth Date"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item
                label="Salary"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                name="salary"
                rules={[{ required: true, message: "Salary is required!" }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Role"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                name="role"
                rules={[{ required: true, message: "Role is required!" }]}
              >
                <Radio.Group>
                  <Radio value="Manager">Manager</Radio>
                  <Radio value="SalesMan">SalesMan</Radio>
                  <Radio value="Accountant">Accountant</Radio>
                  <Radio value="Technical Support">Technical Support</Radio>
                  <Radio value="Secretary">Secretary</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            {/* Right Column */}
            <Col span={12}>
              <Form.Item
                name="address"
                label="Address"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="city"
                label="City"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="country"
                label="Country"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="zipcode"
                label="Zip Code"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Username"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                name="username"
                rules={[{ required: true, message: "Username is required!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Password must be at least 8 characters",
                    min: 8,
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirm"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                dependencies={["password"]} // Dependent on the password field
                rules={[
                  { required: true, message: "Confirm Password is required!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Photo"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Upload
                  beforeUpload={() => false}
                  onChange={handleUploadChange}
                  listType="picture-card"
                  maxCount={1}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Button */}
          <Row>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                htmlType="submit"
                className="submit-button"
              >
                Sign Up
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default SignUpForm;
