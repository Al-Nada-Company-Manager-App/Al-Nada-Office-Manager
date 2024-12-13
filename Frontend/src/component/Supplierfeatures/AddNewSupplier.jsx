import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
const AddNewSupplier = ({ handleFinish }) => {
  const [isSupplierModalVisible, setIsSupplierModalVisible] = useState(false);
  const [name, setName] = useState(0);
  const [address, setAddress] = useState(0);
  const [city, setCity] = useState(0);
  const [country, setCountry] = useState(0);
  const [zipcode, setZipcode] = useState(0);
  const [fax, setFax] = useState(0);
  const [phone, setPhone] = useState(0);
  const [email, setEmail] = useState(0);
   const openSupplierModal = () => setIsSupplierModalVisible(true);
   const closeSupplierModal = () => setIsSupplierModalVisible(false);
  const handleSupplierFinish = async (values) => {
    const supplierdata = {
      ...values,
    };
    console.log("Supplier Data:", supplierdata);
    try {
      handleFinish(supplierdata);
    } catch (error) {
      console.error("Error adding Supplier:", error);
    }
  };
  return (
    <div>
      <Button
        type="primary"
        onClick={openSupplierModal}
        style={{
          marginBottom: "16px",
          backgroundColor: "#389e0d",
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
        }}
        icon={<PlusOutlined />}
      >
        Add Supplier
      </Button>
      <Modal
        title="Add New Supllier"
        open={isSupplierModalVisible}
        onCancel={closeSupplierModal}
        footer={[
          <Button key="close" onClick={closeSupplierModal}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <Form
          onFinish={(values) => {
            handleFinish(values);
            closeSupplierModal();
          }}
          layout="horizontal"
        >
          <Col span={12}>
              <Form.Item label="Name" name="name" required>
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col> 
           <Col span={12}>
              <Form.Item label="Address" name="address" required>
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col> 
            <Col span={12}>
              <Form.Item label="City" name="city" required>
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col> 
            <Col span={12}>
              <Form.Item label="Country" name="country" required>
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col> 
            {/* Zip code */}
            <Col span={12}>
              <Form.Item label="Zip Code" name="zipcode" required>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col> 
            {/*  fax */}
            <Col span={12}>
              <Form.Item label="Fax" name="fax" required>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col> 
            {/* Submit Button */}
            <Col span={48}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Add Supplier
                </Button>
              </Form.Item>
            </Col>
        </Form>
      </Modal>
    </div>
  );
};
export default AddNewSupplier;
