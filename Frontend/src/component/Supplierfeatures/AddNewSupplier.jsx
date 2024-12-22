import React, { useState, useEffect } from "react";
import { Modal, Upload, Form, Input, Button, Col, InputNumber } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSuppliers,
  addSupplier,
  updateSupplierPhoto,
  setaddSupplierModalVisible,
  setFile,
} from "../../Store/Supplier";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const AddNewSupplier = ({ handleFinish }) => {
  const { file, addsupplierModalVisible } = useSelector(
    (state) => state.Suppliers
  );
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { userAccess } = useSelector((state) => state.auth);

  const closeSupplierModal = () => {
    dispatch(setaddSupplierModalVisible(false));
    form.resetFields();
    dispatch(setFile(null));
  };
  const openSupplierModal = () => dispatch(setaddSupplierModalVisible(true));
  const handleSupplierFinish = async (values) => {
    const SupplierData = {};
    Object.entries(values).forEach(
      ([key, value]) => (SupplierData[key] = value)
    );
    const response = await dispatch(addSupplier(SupplierData));
    if (response.payload.success) {
      if (file) {
        const photoData = {};
        photoData.S_ID = response.payload.s_id;
        photoData.photo = file;
        photoData.S_NAME = SupplierData.S_NAME;
        await dispatch(updateSupplierPhoto(photoData));
      }
    }
    dispatch(fetchSuppliers());
    closeSupplierModal();
  };
  const handlefileChange = (file) => {
    dispatch(setFile(file));
  };
  return (
    <div>
      {userAccess.supplier_add && (
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
      )}
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
          form={form}
          onFinish={(values) => {
            handleSupplierFinish(values);
          }}
          layout="horizontal"
        >
          <Col span={12}>
            <Form.Item label="Supplier Name" name="S_NAME" required>
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Address" name="S_ADDRESS" required>
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="City" name="S_CITY" required>
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Country" name="S_COUNTRY" required>
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          {/* Zip code */}
          <Col span={12}>
            <Form.Item label="Zip Code" name="S_ZIPCODE" required>
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          {/*  fax */}
          <Col span={12}>
            <Form.Item label="Fax" name="S_FAX" required>
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
