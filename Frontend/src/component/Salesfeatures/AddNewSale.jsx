import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Row, Col, DatePicker, InputNumber, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CustomerModal from './CustomerModal';
import ProductModal from './ProductModal';

// Dummy data for customers and products
const customers = [{ C_ID: 1, name: "Customer 1" }, { C_ID: 2, name: "Customer 2" }];
const products = [{ P_ID: 1, name: "Product 1" }, { P_ID: 2, name: "Product 2" }];
const statuses = ["Pending", "Completed", "Canceled"];
const currencies = ["USD", "EUR", "EGP"];

const AddNewSale = ({ handleSaleFinish }) => {
  const [isSaleModalVisible, setIsSaleModalVisible] = useState(false);
  const [saleType, setSaleType] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cost, setCost] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [insuranceAmount, setInsuranceAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [status, setStatus] = useState("Pending");

  // Modal visibility states
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);

  const openSaleModal = () => setIsSaleModalVisible(true);
  const closeSaleModal = () => setIsSaleModalVisible(false);

  const onSaleTypeChange = (value) => setSaleType(value);

  const openCustomerModal = () => setIsCustomerModalVisible(true);
  const closeCustomerModal = () => setIsCustomerModalVisible(false);

  const openProductModal = () => setIsProductModalVisible(true);
  const closeProductModal = () => setIsProductModalVisible(false);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    closeCustomerModal();
  };

  const handleSelectProducts = (products) => {
    setSelectedProducts(products);
    closeProductModal();
  };

  useEffect(() => {
    const calculatedTotal = cost - (cost * (discount / 100)) + (cost * (tax / 100));
    setTotal(calculatedTotal);
  }, [cost, discount, tax]);

  return (
    <div>
      <Button
        type="primary"
        onClick={openSaleModal}
        style={{ marginBottom: '16px', backgroundColor: '#389e0d', marginLeft: 'auto', display: 'flex', alignItems: 'center' }}
        icon={<PlusOutlined />}
      >
        Add Sale
      </Button>

      <Modal
        title="Add New Sale"
        open={isSaleModalVisible}
        onCancel={closeSaleModal}
        footer={[
          <Button key="close" onClick={closeSaleModal}>Close</Button>,
        ]}
        width={800}
      >
        <Form
          onFinish={(values) => {
            handleSaleFinish(values);
            closeSaleModal();
          }}
          layout="horizontal"
        >
          <Row gutter={16}>
            {/* Sale Type */}
            <Col span={24}>
              <Form.Item label="Sale Type" name="saleType" required>
                <Select onChange={onSaleTypeChange}>
                  <Select.Option value="SELLITEMS">Sell Items</Select.Option>
                  <Select.Option value="REPAIR">Repair</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Customer Selection */}
            <Col span={24}>
              <Form.Item label="Select Customer" name="customer" required>
                <Button onClick={openCustomerModal}>
                  {selectedCustomer ? selectedCustomer.name : 'Select Customer'}
                </Button>
              </Form.Item>
            </Col>

            {/* Product Selection */}
            {saleType === "SELLITEMS" && (
              <Col span={24}>
                <Form.Item label="Select Product" name="product" required>
                  <Button onClick={openProductModal}>
                    {selectedProducts.length > 0 ? `${selectedProducts.length} Products Selected` : 'Select Products'}
                  </Button>
                </Form.Item>
                {/* Add Product Quantity */}
                <Form.Item label="Quantity" name="quantity" required>
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            )}

            {/* Bill Number */}
            <Col span={24}>
              <Form.Item label="Bill Number" name="billNumber" required>
                <Input />
              </Form.Item>
            </Col>

            {/* Cost */}
            <Col span={12}>
              <Form.Item label="Cost" name="cost" required>
                <InputNumber 
                  value={cost} 
                  onChange={(value) => setCost(value)} 
                  min={0} 
                  style={{ width: "100%" }} 
                />
              </Form.Item>
            </Col>

            {/* Discount */}
            <Col span={12}>
              <Form.Item label="Discount (%)" name="discount" required>
                <InputNumber 
                  value={discount} 
                  onChange={(value) => setDiscount(value)} 
                  min={0} 
                  max={100} 
                  style={{ width: "100%" }} 
                />
              </Form.Item>
            </Col>

            {/* Tax */}
            <Col span={12}>
              <Form.Item label="Tax (%)" name="tax" required>
                <InputNumber 
                  value={tax} 
                  onChange={(value) => setTax(value)} 
                  min={0} 
                  max={100} 
                  style={{ width: "100%" }} 
                />
              </Form.Item>
            </Col>

            {/* Total (Calculated) */}
            <Col span={12}>
              <Form.Item label="Total" name="total" required>
                <InputNumber 
                  value={total} 
                  readOnly 
                  style={{ width: "100%" }} 
                />
              </Form.Item>
            </Col>

            {/* Paid Amount */}
            <Col span={12}>
              <Form.Item label="Paid Amount" name="paidAmount" required>
                <InputNumber 
                  value={paidAmount} 
                  onChange={(value) => setPaidAmount(value)} 
                  min={0} 
                  style={{ width: "100%" }} 
                />
              </Form.Item>
            </Col>

            {/* Insurance Amount */}
            <Col span={12}>
              <Form.Item label="Insurance Amount" name="insuranceAmount" required>
                <InputNumber 
                  value={insuranceAmount} 
                  onChange={(value) => setInsuranceAmount(value)} 
                  min={0} 
                  style={{ width: "100%" }} 
                />
              </Form.Item>
            </Col>

            {/* Status */}
            <Col span={12}>
              <Form.Item label="Status" name="status" required>
                <Select 
                  value={status} 
                  onChange={(value) => setStatus(value)} 
                >
                  {statuses.map((status) => (
                    <Select.Option key={status} value={status}>{status}</Select.Option>
                  ))}
                </Select>
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
                    <Select.Option key={currency} value={currency}>{currency}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Sale Date */}
            <Col span={12}>
              <Form.Item label="Sale Date" name="saleDate" required>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            {/* Submit Button */}
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                  Add Sale
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Customer Modal */}
      <CustomerModal
        visible={isCustomerModalVisible}
        onClose={closeCustomerModal}
        onSelectCustomer={handleSelectCustomer}
        customers={customers}
      />

      {/* Product Modal */}
      <ProductModal
        visible={isProductModalVisible}
        onClose={closeProductModal}
        onSelectProducts={handleSelectProducts}
        products={products}
      />
    </div>
  );
};

export default AddNewSale;
