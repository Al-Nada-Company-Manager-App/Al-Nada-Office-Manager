import React, { useState, useEffect } from "react";
import { Modal, Upload,Form, Input, Button, Col, InputNumber } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSuppliers,
  addSupplier,
  setaddSupplierModalVisible,
} from "../../Store/Supplier";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
const AddNewSupplier = ({ handleFinish }) => {
  const { file, addsupplierModalVisible } = useSelector(
    (state) => state.Suppliers
  );
  const dispatch = useDispatch();

  const closeSupplierModal = () => dispatch(setaddSupplierModalVisible(false));
  const openSupplierModal = () => dispatch(setaddSupplierModalVisible(true));
  const handleSupplierFinish = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (file) formData.append("photo", file);
    await dispatch(addSupplier(supplierdata));
    dispatch(fetchSuppliers());
    closeSupplierModal();
  };
  const handlefileChange = (file) => {
    dispatch(setFile(file));
  }
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
        open={addsupplierModalVisible}
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
            handleSupplierFinish(values);
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
          <Form.Item label="Photo">
            <Upload
              beforeUpload={(file) => {
                handlefileChange(file);
                return false;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Photo</Button>
            </Upload>
          </Form.Item>
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
