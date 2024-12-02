import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SupplierModal from "./SupplierModal";
import ProductModal from "./ProductModal";
import axios from "axios";

const currencies = ["USD", "EUR", "EGP"];

const AddNewPurchase = ({ handleFinish }) => {
  const [isPurchaseModalVisible, setIsParchaseModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null); ////
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cost, setCost] = useState(0);
  const [billnum, setbillnum] = useState(0);
  const [purshasedate, setpurshasedate] = useState(0);

  const [tax, setTax] = useState(0);
  const [Total, setTotal] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [expense, setexpense] = useState(0);
  const [customscost, setcustomscost] = useState(0);
  const [customsnum, setcustomsnum] = useState(0);

  // Modal visibility states
  const [isSupplierModalVisible, setIsSupplierModalVisible] = useState(false); ////
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);

  const openParchaseModal = () => setIsParchaseModalVisible(true);
  const closeSParchaseModal = () => setIsParchaseModalVisible(false);

  //const onSaleTypeChange = (value) => setPurchaseType(value);/// what mean

  const openSupplierModal = () => setIsSupplierModalVisible(true); ///
  const closeSupplierModal = () => setIsSupplierModalVisible(false); ////

  const openProductModal = () => setIsProductModalVisible(true);
  const closeProductModal = () => setIsProductModalVisible(false);

  const handleSelectSupplier = (supplier) => {
    /////
    setSelectedSupplier(supplier);
    closeSupplierModal();
  };

  const handleSelectProducts = (products) => {
    setSelectedProducts(products);
    closeProductModal();
  };

  const calculateTotal = () => {
    const calculatedTotal = cost + cost * (tax / 100);
    setTotal(calculatedTotal);
  };
  useEffect(() => {
    calculateTotal();
    console.log("Total:", Total);
  }, [cost, tax]);

  const handlePurchaseFinish = async (values) => {
    const purchasedata = {
      ...values,
      supplier: selectedSupplier,
      products: selectedProducts,
      total: Total,
    };
    console.log("Purchase Data:", purchasedata);
    try {
      handleFinish(purchasedata);
      console.log("Purchase added successfully:", response.data);
    } catch (error) {
      console.error("Error adding Purchase:", error);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={openParchaseModal}
        style={{
          marginBottom: "16px",
          backgroundColor: "#389e0d",
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
        }}
        icon={<PlusOutlined />}
      >
        Add Sale
      </Button>
      <Modal
        title="Add New Purchase"
        open={isPurchaseModalVisible}
        onCancel={closeSParchaseModal}
        footer={[
          <Button key="close" onClick={closeSParchaseModal}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <Form
          onFinish={(values) => {
            handlePurchaseFinish(values);
            closeSParchaseModal();
          }}
          layout="horizontal"
        >
          <Row gutter={16}>
            {/* Customer Selection */}
            <Col span={24}>
              <Form.Item label="Select Supplier" name="supplier" required>
                <Button onClick={openSupplierModal}>
                  {selectedSupplier
                    ? selectedSupplier.s_name
                    : "Select Supplier"}
                </Button>
              </Form.Item>
            </Col>

            {/* Product Selection */}
            {
              <Col span={24}>
                <Form.Item label="Select Product" name="product" required>
                  <Button onClick={openProductModal}>
                    {selectedProducts.length > 0
                      ? `${selectedProducts.length} Products Selected`
                      : "Select Products"}
                  </Button>
                </Form.Item>
              </Col>
            }

            {/* Bill Number */}
            <Col span={12}>
              <Form.Item label="Bill Number" name="billNumber" required>
                <InputNumber
                  onChange={(value) => setcustomscost(value)}
                  min={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Expense" name="expense" required>
                <InputNumber
                  onChange={(value) => setexpense(value)}
                  min={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Customs Cost" name="customscost" required>
                <InputNumber
                  onChange={(value) => setcustomscost(value)}
                  min={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Customs Num" name="customsnum" required>
                <InputNumber
                  onChange={(value) => setcustomsnum(value)}
                  min={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            {/* Cost */}
            <Col span={12}>
              <Form.Item label="Cost" name="cost" required>
                <InputNumber
                  value={cost || 0}
                  onChange={(value) => setCost(value)}
                  min={0}
                  style={{ width: "100%" }}
                  onBlur={calculateTotal}
                />
              </Form.Item>
            </Col>

            {/* Tax */}
            <Col span={12}>
              <Form.Item label="Tax (%)" name="tax" required>
                <InputNumber
                  value={tax || 0}
                  onChange={(value) => setTax(value)}
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                  onBlur={calculateTotal}
                />
              </Form.Item>
            </Col>

            {/* Total (Calculated) */}
            <Col span={12}>
              <Form.Item label="Total" name="total" required>
                <InputNumber
                  value={Total}
                  placeholder={Total}
                  readOnly
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            {/* Currency */}
            <Col span={12}>
              <Form.Item label="Currency" name="currency" required>
                <Select
                  value={currency}
                  onChange={(value) => setCurrency(value)}
                >
                  {currencies.map((currency) => (
                    <Select.Option key={currency} value={currency}>
                      {currency}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Sale Date */}
            <Col span={12}>
              <Form.Item label="Purchase Date" name="purshasedate" required>
                <DatePicker style={{ width: "100%" }} />
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
                  Add Purchase
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Customer Modal */}
      <SupplierModal
        visible={isSupplierModalVisible}
        onClose={closeSupplierModal}
        onSelectSupplier={handleSelectSupplier}
      />

      {/* Product Modal */}
      <ProductModal
        visible={isProductModalVisible}
        onClose={closeProductModal}
        onSelectProducts={handleSelectProducts}
      />
    </div>
  );
};

export default AddNewPurchase;
