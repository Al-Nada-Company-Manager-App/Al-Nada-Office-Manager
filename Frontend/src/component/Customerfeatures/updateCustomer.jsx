import React from "react";
import { Form, Input, Button, Modal, Upload } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCustomers,
  setupdateCustomerModalVisible,
  updateCustomer,
} from "../../Store/Customer";
import { UploadOutlined } from "@ant-design/icons";

const UpdateCustomerModal = () => {
  const { selectedCustomer,updatecustomerModalVisible,file } = useSelector((state) => state.Customers);
  const dispatch = useDispatch();

  const handleUpdateCustomer = async (values) => {
    const formData = new FormData();

    formData.append("C_ID", selectedCustomer.c_id); 

    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );

    if (file) formData.append("photo", file);

    await dispatch(updateCustomer(formData));
    dispatch(fetchCustomers());
    dispatch(setupdateCustomerModalVisible(false));
  };

  const handleupdateClose = () => {
    dispatch(setupdateCustomerModalVisible(false));
  };

  return (
    <div>
      <Modal
        title="Update Customer"
        open={updatecustomerModalVisible}
        onCancel={() => handleupdateClose()}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleUpdateCustomer}
          initialValues={selectedCustomer}
        >
          <Form.Item
            name="C_NAME"
            label="Customer Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="C_ADDRESS"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="C_CITY" label="City" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="C_COUNTRY"
            label="Country"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="C_ZIPCODE"
            label="Zip Code"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="C_FAX" label="Fax">
            <Input />
          </Form.Item>
          <Form.Item label="Photo">
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Photo</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateCustomerModal;
