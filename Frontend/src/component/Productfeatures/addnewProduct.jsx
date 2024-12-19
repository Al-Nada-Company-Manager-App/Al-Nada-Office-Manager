import React from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Upload,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  handleAddProduct,
  fetchProducts,
  updatesproductphoto,
  setaddProductModalVisible,
  setFile,
} from "../../Store/Product";

// eslint-disable-next-line react/prop-types
const AddnewProduct = () => {
  const dispatch = useDispatch();
  const { file, addProductModalVisible } = useSelector(
    (state) => state.Products
  );
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [ischemical, setischemical] = React.useState(false);
  const [form] = Form.useForm();
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setischemical(value === "Chemical");
  };

  const handlenewModalClose = () => {
    dispatch(setaddProductModalVisible(false));
    dispatch(setFile(null));
    form.resetFields();
  };
  const handlenewModalOpen = () => {
    dispatch(setaddProductModalVisible(true));
  };
  const handleUploadChange = (info) => {
    if (info.fileList.length > 0) {
      const filee = info.fileList[0].originFileObj;
      dispatch(setFile(filee));
    } else {
      setFile(null);
    }
  };

  const handleFinish = async (values) => {
    const productData = {};
    if (values.category === "Chemical") {
      productData.expiredate = values.expiredate
        ? values.expiredate.format("YYYY-MM-DD")
        : null;
    }

    Object.keys(values).forEach((key) => {
      productData[key] = values[key];
    });
    const response = await dispatch(handleAddProduct(productData));
    if (response.payload.success) {
      if (file) {
        const photoData = {};
        photoData.P_ID = response.payload.p_id;
        photoData.photo = file;
        await dispatch(updatesproductphoto(photoData));
      }
    }
    dispatch(fetchProducts());
    handlenewModalClose();
  };

  return (
    <div>
      <Button
        style={{
          position: "absolute",
          right: "40px",
          top: "130px",
        }}
        type="primary"
        onClick={handlenewModalOpen}
        icon={<PlusOutlined />}
        iconPosition="start"
      >
        Add Product
      </Button>
      <Modal
        title="Add New Poduct"
        centered
        open={addProductModalVisible}
        onCancel={handlenewModalClose}
        footer={[
          <Button key="close" onClick={handlenewModalClose}>
            Close
          </Button>,
        ]}
        width={1000}
      >
        <Form
          layout="horizontal"
          form={form}
          className="employee-form"
          onFinish={(values) => {
            if (handleFinish(values)) {
              handlenewModalClose();
            }
          }}
        >
          <Row gutter={16}>
            {/* Left Column */}
            <Col span={12}>
              <Form.Item
                name="productPhoto"
                label="Product Photo"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 16 }}
                valuePropName="fileList" // Maps the Upload's file list to the form field
                getValueFromEvent={(e) => e && e.fileList} // Extracts file list from event
              >
                <Upload
                  beforeUpload={() => false}
                  listType="picture-card"
                  maxCount={1}
                  onChange={handleUploadChange}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item
                label="Product Name"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 16 }}
                name="productname"
                rules={[
                  { required: true, message: "Product name is required!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Category"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 16 }}
                name="category"
                rules={[{ required: true, message: "Category is required!" }]}
              >
                <Select
                  placeholder="Select a category"
                  onChange={handleCategoryChange}
                >
                  <Select.Option value="Spare Part">Spare Part</Select.Option>
                  <Select.Option value="Laboratory Equipment">
                    Laboratory Equipment
                  </Select.Option>
                  <Select.Option value="Chemical">Chemical</Select.Option>
                  <Select.Option value="Measuring & Controllers">
                    Measuring & Controllers
                  </Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
              </Form.Item>
              {selectedCategory === "Other" && (
                <Form.Item
                  label="Specify Category"
                  labelCol={{ span: 11 }}
                  wrapperCol={{ span: 16 }}
                  name="customCategory"
                  rules={[
                    { required: true, message: "Please specify the category!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              )}
              <Form.Item
                label="Quantity"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 16 }}
                name="quantity"
                rules={[{ required: true, message: "Quantity is required!" }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Cost Price"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 16 }}
                name="costprice"
                rules={[
                  { required: true, message: "Please specify the Cost Price!" },
                ]}
              >
                <InputNumber suffix="EGP" style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Sell Price"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 16 }}
                name="sellprice"
                rules={[
                  { required: true, message: "Please specify the Sell Price!" },
                ]}
              >
                <InputNumber suffix="EGP" style={{ width: "100%" }} />
              </Form.Item>
              {ischemical && (
                <Form.Item
                  name="expiredate"
                  label="Expire Date"
                  labelCol={{ span: 11 }}
                  wrapperCol={{ span: 16 }}
                >
                  <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
              )}
              <Form.Item
                label="Model Code"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 16 }}
                name="modelcode"
              >
                <Input />
              </Form.Item>
            </Col>

            {/* Right Column */}

            <Col span={12}>
              <Form.Item
                label="Product Description"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 16 }}
                name="pdescription"
              >
                <Input.TextArea style={{ width: "300px" }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Button */}
          <Row>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                htmlType="submit"
                className="submit-button"
              >
                Add Product
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddnewProduct;
