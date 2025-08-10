import {
  Form,
  Input,
  Button,
  Modal,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Select,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  updateProduct,
  setFile,
  setupdateProductModalVisible,
  fetchProducts,
  updatesproductphoto,
  setSelecteditem,
} from "../../Store/Product";
import { setSelectedCustomer } from "../../Store/Customer";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const { selectedProduct, updateProductModalVisible, file } = useSelector(
    (state) => state.Products
  );
  const [form] = Form.useForm();

  const handlefileChange = ({ fileList: newFileList }) => {
    dispatch(setFile(newFileList[0]?.originFileObj));
  };

  const handleUpdateProduct = async (values) => {
    const productData = {};
    if (values.category === "Chemical") {
      productData.expiredate = values.expiredate
        ? values.expiredate.format("YYYY-MM-DD")
        : null;
    }
    productData.P_ID = selectedProduct.p_id;

    Object.entries(values).forEach(
      ([key, value]) => (productData[key] = value)
    );
    const res = await dispatch(updateProduct(productData));
    if (res.payload.success) {
      message.success("Product updated successfully");
    } else {
      message.error("Error updating product");
    }

    if (file) {
      const photoData = {};
      photoData.P_ID = selectedProduct.p_id;
      photoData.photo = file;
      await dispatch(updatesproductphoto(photoData));
    }
    dispatch(fetchProducts());
    closeupdateProduct();
  };
  React.useEffect(() => {
    if (selectedProduct) {
      const transformedProduct = {
        ...selectedProduct,
        expire_date: selectedProduct.expire_date
          ? dayjs(selectedProduct.expire_date) // Convert to day.js object
          : null,
      };

      form.setFieldsValue(transformedProduct);
    }
  }, [selectedProduct, form]);
  const closeupdateProduct = () => {
    dispatch(setupdateProductModalVisible(false));
    dispatch(setFile(null));
    dispatch(setSelecteditem(null));
    form.resetFields();
  };

  return (
    <div>
      <Modal
        title="Update Product"
        centered
        open={updateProductModalVisible}
        onCancel={closeupdateProduct}
        width={1000}
        footer={[
          <Button key="close" onClick={closeupdateProduct}>
            Close
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="horizontal"
          className="edit-product-form"
          onFinish={handleUpdateProduct}
          initialValues={selectedProduct}
        >
          <Row gutter={16}>
            {/* Left Column */}
            <Col span={12}>
              <Form.Item
                name="productPhoto"
                label="Product Photo"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 16 }}
                valuePropName="fileList"
                getValueFromEvent={(e) => e && e.fileList}
              >
                <Upload
                  beforeUpload={() => false}
                  listType="picture-card"
                  maxCount={1}
                  onChange={handlefileChange}
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
                name="p_name"
                rules={[
                  { required: true, message: "Product name is required!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Quantity"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 16 }}
                name="p_quantity"
                rules={[{ required: true, message: "Quantity is required!" }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Cost Price"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 16 }}
                name="p_costprice"
                rules={[{ required: true, message: "Price is required!" }]}
              >
                <InputNumber suffix="EGP" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Sell Price"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 16 }}
                name="p_sellprice"
                rules={[{ required: true, message: "Sell Price is required!" }]}
              >
                <InputNumber suffix="EGP" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Model Code"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 16 }}
                name="model_code"
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
                name="p_description"
              >
                <Input.TextArea style={{ width: "300px" }} />
              </Form.Item>
              {selectedProduct.p_category === "Chemical" && (
                <Form.Item
                  name="expire_date"
                  label="Expire Date"
                  labelCol={{ span: 11 }}
                  wrapperCol={{ span: 16 }}
                >
                  <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
              )}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateProduct;
