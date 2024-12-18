import React from "react";
import { Form, Input, Button, Modal, Upload } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSuppliers,
  setupdateSupplierModalVisible,
  updateSupplier,
  setFile,
  updateSupplierPhoto,
  setSelectedSupplier,
} from "../../Store/Supplier";
import { UploadOutlined } from "@ant-design/icons";

const UpdateSupplierModal = () => {
  const dispatch = useDispatch();
  const { selectedSupplier, file, updatesupplierModalVisible } = useSelector(
    (state) => state.Suppliers
  );
  const [form] = Form.useForm();
  React.useEffect(() => {
    form.setFieldsValue(selectedSupplier);
  }, [selectedSupplier]);
  const handlefileChange = (file) => {
    dispatch(setFile(file));
  };
  const handleUpdateSupplier = async (values) => {
    const SupplierData = {};
    console.log(selectedSupplier);
    SupplierData.S_ID = selectedSupplier.s_id;

    Object.entries(values).forEach(
      ([key, value]) => (SupplierData[key] = value)
    );

    await dispatch(updateSupplier(SupplierData));
    const photoData = {};
    if (file) {
      photoData.S_ID = selectedSupplier.s_id;
      photoData.photo = file;
      photoData.S_NAME = SupplierData.S_NAME;
      await dispatch(updateSupplierPhoto(photoData));
    }
    dispatch(fetchSuppliers());
    handleupdateClose();
  };

  const handleupdateClose = () => {
    dispatch(setupdateSupplierModalVisible(false));
    dispatch(setFile(null));
    dispatch(setSelectedSupplier(null));
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
          form={form}
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

export default UpdateSupplierModal;
