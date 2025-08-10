import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Upload,
  Avatar,
  Row,
  Col,
  message,
} from "antd";
import { UploadOutlined, LockOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { updateUserProfile, updateuserphoto } from "../../Store/UserProfile";
import "../../Styles/UserProfile.css"; // Import the CSS file
import { useDispatch } from "react-redux";
import { handleLogout } from "../../Store/authSlice";
import { setpasswordChangedModalVisible } from "../../Store/authSlice";
import FormChangePassword from "./PasswordChange";
import moment from "moment";

const UserProfile = () => {
  const dispatch = useDispatch();

  const { SignedUser } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    ...SignedUser,
    BirthDate: SignedUser.birth_date
      ? moment(SignedUser.birth_date).format("YYYY-MM-DD")
      : "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const handleFormChange = (changedValues) => {
    setFormData({ ...formData, ...changedValues });
    setIsEditing(true);
  };
  const [form] = Form.useForm();

  const handleCancel = () => {
    setFormData({
      ...SignedUser,
      BirthDate: SignedUser.birth_date
        ? moment(SignedUser.birth_date).format("YYYY-MM-DD")
        : "",
    });
    setFile(null);
    setIsEditing(false);
    form.resetFields();
  };
  useEffect(() => {
    form.setFieldsValue(formData); // Update form fields when formData changes
  }, [formData, form]);
  const handleUpdate = async () => {
    await dispatch(updateUserProfile(formData))
      .then(() => {
        message.success("User information updated successfully!");
        setFormData(formData);
        dispatch(handleLogout());
      })
      .catch(() => {
        message.error("Failed to update user information.");
      });
    if (file) {
      const photoData = {};
      photoData.E_ID = formData.e_id;
      photoData.photo = file;
      console.log(photoData);
      dispatch(updateuserphoto(photoData));
    }

    setIsEditing(false);
  };

  const handlePhotoChange = (info) => {
    setFile(info.file.originFileObj); // Correctly use the setter function
    const newPhotoURL = URL.createObjectURL(info.file.originFileObj);
    setFormData({ ...formData, Photo: newPhotoURL });
    setIsEditing(true);
  };

  const handleChangePassword = () => {
    dispatch(setpasswordChangedModalVisible(true));
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onValuesChange={(_, allValues) => handleFormChange(allValues)}
      >
        {/* First Row - Single Card */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={24}>
            <Card>
              <Row gutter={[16, 16]}>
                {/* First Column: Photo and Upload */}
                <Col xs={24} md={8}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%", // Ensures the column takes up full height
                    }}
                  >
                    <Avatar
                      src={
                        file
                          ? URL.createObjectURL(file)
                          : SignedUser.e_photo
                          ? "./Users/" + SignedUser.e_photo
                          : "https://via.placeholder.com/150"
                      }
                      size={100}
                      style={{ marginBottom: 16 }}
                    />
                    <Upload
                      name="photo"
                      showUploadList={false}
                      onChange={handlePhotoChange}
                    >
                      <Button
                        icon={<UploadOutlined />}
                        style={{ marginBottom: 16, width: "100%" }}
                      >
                        Change Photo
                      </Button>
                    </Upload>
                    <Button
                      icon={<LockOutlined />}
                      type="primary"
                      danger
                      style={{ width: "100%" }}
                      onClick={handleChangePassword}
                    >
                      Change Password
                    </Button>
                  </div>
                </Col>

                {/* Second Column: Name and Birth Date */}
                <Col xs={24} md={8}>
                  <Form.Item label="First Name" name="f_name">
                    <Input placeholder="First Name" />
                  </Form.Item>
                  <Form.Item label="Last Name" name="l_name">
                    <Input placeholder="Last Name" />
                  </Form.Item>
                  <Form.Item label="Birth Date" name="birth_date">
                    <Input
                      type="date"
                      defaultValue={
                        SignedUser.birth_date
                          ? moment(SignedUser.birth_date).format("YYYY-MM-DD")
                          : ""
                      }
                    />
                  </Form.Item>
                </Col>

                {/* Third Column: Username and Salary */}
                <Col xs={24} md={8}>
                  <Form.Item label="Username" name="e_username">
                    <Input placeholder="Username" />
                  </Form.Item>
                  <Form.Item label="Salary" name="salary">
                    <Input type="number" placeholder="Salary" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Second Row - Two Cards */}
        <Row gutter={[16, 16]}>
          {/* Second Card */}
          <Col xs={24} md={12}>
            <Card>
              <Row gutter={[16, 16]}>
                {/* First Column: Address and City */}
                <Col xs={24} md={12}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%", // Ensures the column takes up full height
                    }}
                  >
                    <Form.Item label="Address" name="e_address">
                      <Input placeholder="Address" />
                    </Form.Item>
                    <Form.Item label="City" name="e_city">
                      <Input placeholder="City" />
                    </Form.Item>
                  </div>
                </Col>

                {/* Second Column: Country and Zip Code */}
                <Col xs={24} md={12}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%", // Ensures the column takes up full height
                    }}
                  >
                    <Form.Item label="Country" name="e_country">
                      <Input placeholder="Country" />
                    </Form.Item>
                    <Form.Item label="Zip Code" name="e_zipcode">
                      <Input placeholder="Zip Code" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Third Card */}
          <Col xs={24} md={12}>
            <Card>
              <Row gutter={[16, 16]}>
                {/* First Column: Email */}
                <Col xs={24} md={12}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%", // Ensures the column takes up full height
                    }}
                  >
                    <Form.Item label="Email" name="e_email">
                      <Input type="email" placeholder="Email" />
                    </Form.Item>
                  </div>
                </Col>

                {/* Second Column: Phone */}
                <Col xs={24} md={12}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%", // Ensures the column takes up full height
                    }}
                  >
                    <Form.Item label="Phone" name="e_phone">
                      <Input placeholder="Phone" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {isEditing && (
          <Row justify="end" style={{ marginTop: 16 }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleUpdate}>
              Update
            </Button>
          </Row>
        )}
      </Form>
      <FormChangePassword />
    </>
  );
};

export default UserProfile;
