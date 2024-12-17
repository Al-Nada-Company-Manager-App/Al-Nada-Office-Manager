import React from "react";
import { Form, Input, Button, Modal, Upload } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSuppliers,
  setupdateSupplierModalVisible,
  updateSupplier,
} from "../../Store/Supplier";
import { UploadOutlined } from "@ant-design/icons";

const UpdateSupplierModal = () => {
  const dispatch = useDispatch();
  const {selectedSupplier,file,updatesupplierModalVisible} = useSelector((state) => state.Suppliers);

  const handleUpdateSupplier = async (values) => {
    const formData = new FormData();

    formData.append("S_ID", selectedSupplier.s_id); 

    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );

    if (file) formData.append("photo", file);

    await dispatch(updateSupplier(formData));
    dispatch(fetchSuppliers());
    dispatch(setupdateSupplierModalVisible(false));
  };

  const handleupdateClose = () => {
    dispatch(setupdateSupplierModalVisible(false));
  };

  return (
    <div>
      <Modal
        title="Update Supplier"
        open={updatesupplierModalVisible}
        onCancel={() => handleupdateClose()}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleUpdateSupplier}
          initialValues={selectedSupplier}
        >
          <Form.Item
            name="s_name"
            label="Supplier Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="s_address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="s_city" label="City" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="s_country"
            label="Country"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="s_zipcode"
            label="Zip Code"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="s_fax" label="Fax">
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

export default UpdateSupplierModal;
