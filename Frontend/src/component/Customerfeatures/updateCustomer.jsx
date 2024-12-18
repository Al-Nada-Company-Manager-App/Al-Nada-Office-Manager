import React from "react";
import { Form, Input, Button, Modal, Upload } from "antd";
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
    const CutomerData = {};
    CutomerData.C_ID = selectedCustomer.c_id;

    Object.entries(values).forEach(
      ([key, value]) => (CutomerData[key] = value)
    );

    await dispatch(updateCustomer(CutomerData));
    const photoData = {};
    if (file) {
      photoData.C_ID = selectedCustomer.c_id;
      photoData.photo = file;
      photoData.C_NAME = CutomerData.C_NAME;
      await dispatch(updateCustomerPhoto(photoData));
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
