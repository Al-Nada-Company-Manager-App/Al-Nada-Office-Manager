import React from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  Upload,
  message,
} from "antd";
import  {useSelector,useDispatch} from "react-redux";
import { updateCustomerPhoto,setFile,fetchCustomers,addCustomer, setaddCustomerModalVisible} from "../../Store/Customer";
import { UploadOutlined } from "@ant-design/icons";



const AddnewCustomer = () => {
const { addcustomerModalVisible,file } = useSelector((state) => state.Customers);
const dispatch = useDispatch();

const handlefileChange = (file) => {
    dispatch(setFile(file));
  };



const handleAddCustomer = async (values) => {
    const CutomerData={};
    Object.entries(values).forEach(([key, value]) =>
          CutomerData[key] = value
    );
    const response= await dispatch(addCustomer(CutomerData));
    if(response.payload.success){
        if(file){
            const photoData ={};
            photoData.C_ID=response.payload.c_id;
            photoData.photo=file;
            photoData.C_NAME=CutomerData.C_NAME;
            await dispatch(updateCustomerPhoto(photoData));
        }
    }


   dispatch(fetchCustomers());
   dispatch(setaddCustomerModalVisible(false));
  };

  const handleaddClose = () => {
    dispatch(setaddCustomerModalVisible(false));
  }


return (
    <div>
      <Modal
      title="Add Customer"
       open={addcustomerModalVisible}
       onCancel={() => handleaddClose()}
      footer={null}
    >
      { <Form layout="vertical" onFinish={handleAddCustomer}>
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
              handlefileChange(file);
              return false;
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Photo</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form> }
    </Modal>
    </div>
  );
};

export default AddnewCustomer;
