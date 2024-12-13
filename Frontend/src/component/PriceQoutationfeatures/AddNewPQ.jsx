import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  InputNumber,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  setAddPQModalVisible,
  addPriceQuotation,
  fetchPriceQuotations,
} from "../../Store/PriceQuotation";
import {
  setSelectedCustomerModalVisible,
  setSelectedCustomer,
} from "../../Store/Customer";
import CustomerModal from "../Salesfeatures/CustomerModal";
import {
  setSelectedProductModalVisible,
  setSelectedProduct,
  fetchProducts,
} from "../../Store/Product";
import ProductModal from "../Salesfeatures/ProductModal";

const currencies = ["USD", "EUR", "EGP"];
const AddNewPriceQuotation = () => {
  const { selectedCustomer } = useSelector((state) => state.Customers);
  const { selectedProducts } = useSelector((state) => state.Products);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [duration, setDuration] = useState(0);
  const [form] = Form.useForm();
  const openPQModal = () => dispatch(setAddPQModalVisible(true));
  const closePQModal = () => {
    dispatch(setAddPQModalVisible(false));
    dispatch(setSelectedCustomer(null));
    dispatch(setSelectedProduct([]));
    setDiscount(0);
    setDuration(0);
    setTotal(0);
    form.resetFields();
  };

  const openCustomerModal = () =>
    dispatch(setSelectedCustomerModalVisible(true));
  const openProductModal = () => {
    dispatch(fetchProducts());
    dispatch(setSelectedProduct([]));
    dispatch(setSelectedProductModalVisible(true));
  };
  React.useEffect(() => {
    const calculateTotal = () => {
      let tota = 0;
      selectedProducts.forEach((product) => {
        tota += product.p_sellprice;
      });
      tota = tota - tota * (discount / 100);
      setTotal(tota);
    };
    calculateTotal();
  }, [selectedProducts,discount]);
  const dispatch = useDispatch();
  const { addPQModalVisible } = useSelector((state) => state.PriceQuotations);

  const handlePQFinish = async (values) => {
    const pqdata = {
      ...values,
      customer: selectedCustomer,
      products: selectedProducts,
      total: total,
      
    };
    await dispatch(addPriceQuotation(pqdata));
    dispatch(fetchPriceQuotations());
    closePQModal();
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={openPQModal}
        style={{
          marginBottom: "16px",
          backgroundColor: "#389e0d",
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
        }}
        icon={<PlusOutlined />}
      >
        Add Price Quotation
      </Button>
      <Modal
        title="Add New Price Quotation"
        open={addPQModalVisible}
        onCancel={closePQModal}
        footer={[
          <Button key="close" onClick={closePQModal}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <Form
          form={form}
          onFinish={(values) => {
            handlePQFinish(values);
          }}
          layout="horizontal"
        >
          <Row gutter={16}>
            {/* Customer */}
            <Col span={24}>
              <Form.Item label="Select Customer" name="customer" required>
                <Button onClick={openCustomerModal}>
                  {selectedCustomer
                    ? selectedCustomer.c_name
                    : "Select Customer"}
                </Button>
              </Form.Item>
            </Col>

            {/* Product Selection */}
            <Col span={24}>
              <Form.Item label="Select Products" name="products" required>
                <Button onClick={openProductModal}>
                  {selectedProducts.length > 0
                    ? `${selectedProducts.length} Products Selected`
                    : "Select Products"}
                </Button>
              </Form.Item>
            </Col>

            {/* Discount */}
            <Col span={12}>
              <Form.Item label="Discount (%)" name="pq_discount" required>
                <InputNumber
                  onChange={(value) => setDiscount(value)}
                  defaultValue={0}
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            {/* Total (Calculated) */}
            <Col span={12}>
              <Form.Item label="Total" required>
                <InputNumber
                  value={total}
                  placeholder="Total"
                  readOnly
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            {/* Currency */}
            <Col span={12}>
              <Form.Item label="Currency" name="pq_currency" required>
                <Select placeholder="Select Currency">
                  {currencies.map((currency) => (
                    <Select.Option key={currency} value={currency}>
                      {currency}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Duration */}
            <Col span={12}>
              <Form.Item
                label="Duration"
                name="pq_duration"
                rules={[
                  {
                    required: true,
                    message: "Please select the duration in days!",
                  },
                ]}
              >
                <InputNumber
                  onChange={(value) => setDuration(value)}
                  min={1}
                  placeholder="Number of days"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            {/* Submit Button */}
            <Col span={24}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Add Price Quotation
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <CustomerModal />
      <ProductModal />
    </div>
  );
};

export default AddNewPriceQuotation;
