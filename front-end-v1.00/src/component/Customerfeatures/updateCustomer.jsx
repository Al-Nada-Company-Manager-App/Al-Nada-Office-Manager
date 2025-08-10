import React from "react";
import { Form, Input, Button, Modal, Upload, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCustomers,
  setupdateCustomerModalVisible,
  updateCustomer,
  updateCustomerPhoto,
  setFile,
} from "../../Store/Customer";
import { UploadOutlined } from "@ant-design/icons";

const UpdateCustomerModal = () => {
  const { selectedCustomer, updatecustomerModalVisible, file } = useSelector(
    (state) => state.Customers
  );
  const dispatch = useDispatch();
  const handlefileChange = (file) => {
    dispatch(setFile(file));
  };

  const handleUpdateCustomer = async (values) => {
    const customerData = {
      C_ID: selectedCustomer.c_id,
      ...values, 
    };
  
    await dispatch(updateCustomer(customerData));
    if (file) {
      const formData = new FormData();
      formData.append("C_ID", selectedCustomer.c_id); // Append the customer ID
      formData.append("photo", file); // Append the photo file  
      await dispatch(updateCustomerPhoto(formData)); // Dispatch the photo update
    }
  
    dispatch(fetchCustomers());
    handleupdateClose();
  };
  const [form] = Form.useForm(); 
  React.useEffect(() => {
      form.setFieldsValue(selectedCustomer);
    }, [selectedCustomer]);
  const handleupdateClose = () => {
    dispatch(setupdateCustomerModalVisible(false));
    dispatch(setFile(null));
  };

  return (
    <div>
      <Modal
        title="Update Customer"
        open={updatecustomerModalVisible}
        onCancel={handleupdateClose}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateCustomer}
          initialValues={selectedCustomer}
        >
          <Form.Item
            name="c_name"
            label="Customer Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="c_address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="c_city" label="City" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="c_country"
            label="Country"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="c_zipcode"
            label="Zip Code"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="c_fax" label="Fax">
            <Input />
          </Form.Item>
          <Form.Item label="Photo">
            <Upload
              beforeUpload={(file) => {
                handlefileChange(file);
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
