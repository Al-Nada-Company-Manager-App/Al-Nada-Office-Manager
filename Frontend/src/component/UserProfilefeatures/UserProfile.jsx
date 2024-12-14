import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Upload,
  Avatar,
  Row,
  Col,
  message
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";



const UserProfile = () => {
  const { SignedUser } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(SignedUser);
  const [isEditing, setIsEditing] = useState(false);

  const handleFormChange = (changedValues) => {
    setFormData({ ...formData, ...changedValues });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(SignedUser);
    setIsEditing(false);
  };

  const handleUpdate = () => {
    message.success("User information updated successfully!");
    setIsEditing(false);
  };

  const handlePhotoChange = (info) => {
    if (info.file.status === "done") {
      const newPhotoURL = URL.createObjectURL(info.file.originFileObj);
      setFormData({ ...formData, Photo: newPhotoURL });
      setIsEditing(true);
    }
  };

  return (
    <Form
      layout="vertical"
      initialValues={formData}
      onValuesChange={(_, allValues) => handleFormChange(allValues)}
    >
      <Row gutter={[16, 16]}>
        {/* First Card */}
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Avatar
                src={formData.Photo}
                size={100}
                style={{ marginBottom: 16 }}
              />
              <Upload
                name="photo"
                showUploadList={false}
                onChange={handlePhotoChange}
              >
                <Button icon={<UploadOutlined />}>Change Photo</Button>
              </Upload>
            </div>
            <Form.Item label="First Name" name="fName">
              <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item label="Last Name" name="lName">
              <Input placeholder="Last Name" />
            </Form.Item>
            <Form.Item label="Birth Date" name="BirthDate">
              <Input type="date" />
            </Form.Item>
            <Form.Item label="Username" name="username">
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item label="Salary" name="salary">
              <Input type="number" placeholder="Salary" />
            </Form.Item>
          </Card>
        </Col>

        {/* Second Card */}
        <Col xs={24} md={8}>
          <Card>
            <Form.Item label="Address" name="Address">
              <Input placeholder="Address" />
            </Form.Item>
            <Form.Item label="City" name="city">
              <Input placeholder="City" />
            </Form.Item>
            <Form.Item label="Country" name="country">
              <Input placeholder="Country" />
            </Form.Item>
            <Form.Item label="Zip Code" name="zipcode">
              <Input placeholder="Zip Code" />
            </Form.Item>
          </Card>
        </Col>

        {/* Third Card */}
        <Col xs={24} md={8}>
          <Card>
            <Form.Item label="Email" name="email">
              <Input type="email" placeholder="Email" />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input placeholder="Phone" />
            </Form.Item>
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
  );
};

export default UserProfile;