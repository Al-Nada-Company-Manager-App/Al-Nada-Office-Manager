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
import CustomerModal from "./CustomerModal";
import ProductModal from "./ProductModal";
import { useSelector, useDispatch } from "react-redux";
import {
  setSaleType,
  addSale,
  setaddSaleModalVisible,
  fetchSales,
} from "../../Store/Sales";
import { setSelectedCustomerModalVisible,setSelectedCustomer } from "../../Store/Customer";
import { setSelectedProductModalVisible,setSelectedProduct,fetchProducts } from "../../Store/Product";

const statuses = ["Pending", "Completed", "Canceled"];
const currencies = ["USD", "EUR", "EGP"];

const AddNewSale = () => {
  const dispatch = useDispatch();
  const { saleType, addSaleModalVisible } =
    useSelector((state) => state.Sales);
  const { selectedCustomer } = useSelector((state) => state.Customers);
  const { selectedProducts } = useSelector((state) => state.Products);
  const [cost, setCost] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  const [form] = Form.useForm();

  const closeSaleModal = () => {
    dispatch(setaddSaleModalVisible(false));
    dispatch(setSelectedCustomer(null));
    dispatch(setSelectedProduct([]));
    dispatch(setSaleType(""));
    setCost(0);
    setDiscount(0);
    setTax(0);
    setTotal(0);
    form.resetFields();
  };

  const onSaleTypeChange = (value) => {
    dispatch(setSaleType(value));
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
      const totalCost = cost - (cost * discount) / 100;
      const totalTax = (totalCost * tax) / 100;
      const totalAmount = totalCost + totalTax;
      setTotal(totalAmount);
    };
    calculateTotal();
  }, [cost, discount, tax]);

  const handleSaleFinish = async (values) => {
    const saleData = {
      ...values,
      customer: selectedCustomer,
      products: selectedProducts,
      total: total,
    };
    await dispatch(addSale(saleData));
    dispatch(fetchSales());
    closeSaleModal();
  };

  return (
    <div>
      
      <Modal
        title="Add New Sale"
        open={addSaleModalVisible}
        onCancel={closeSaleModal}
        footer={[
          <Button key="close" onClick={closeSaleModal}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <Form
          form={form}
          onFinish={(values) => {
            handleSaleFinish(values);
          }}
          layout="horizontal"
        >
          <Row gutter={16}>
            {/* Sale Type */}
            <Col span={24}>
              <Form.Item label="Sale Type" name="saleType" required>
                <Select
                  onChange={onSaleTypeChange}
                  placeholder="Select Sale Type"
                >
                  <Select.Option value="SELLITEMS">Sell Items</Select.Option>
                  <Select.Option value="REPAIR">Repair</Select.Option>
                  <Select.Option value="SERVICE">Service</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Customer Selection */}
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
            {saleType === "SELLITEMS" && (
              <Col span={24}>
                <Form.Item label="Select Product" name="product" required>
                  <Button onClick={openProductModal}>
                    {Array.isArray(selectedProducts) &&
                    selectedProducts.length > 0
                      ? `${selectedProducts.length} Products Selected`
                      : "Select Products"}
                  </Button>
                </Form.Item>
              </Col>
            )}

            {/* Bill Number */}
            <Col span={24}>
              <Form.Item label="Bill Number" name="billNumber" required>
                <Input defaultValue={0} />
              </Form.Item>
            </Col>

            {/* Cost */}
            <Col span={12}>
              <Form.Item label="Cost" name="cost" required>
                <InputNumber
                  defaultValue={0}
                  min={0}
                  style={{ width: "100%" }}
                  onChange={(value) => setCost(value)}
                />
              </Form.Item>
            </Col>

            {/* Discount */}
            <Col span={12}>
              <Form.Item label="Discount (%)" name="discount" required>
                <InputNumber
                  defaultValue={0}
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                  onChange={(value) => setDiscount(value)}
                />
              </Form.Item>
            </Col>

            {/* Tax */}
            <Col span={12}>
              <Form.Item label="Tax (%)" name="tax" required>
                <InputNumber
                  defaultValue={0}
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                  onChange={(value) => setTax(value)}
                />
              </Form.Item>
            </Col>

            {/* Total (Calculated) */}
            <Col span={12}>
              <Form.Item label="Total" required>
                <InputNumber
                  value={total}
                  placeholder="Enter total"
                  readOnly
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            {/* Paid Amount */}
            <Col span={12}>
              <Form.Item label="Paid Amount" name="paidAmount" required>
                <InputNumber
                  defaultValue={0}
                  min={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            {/* Insurance Amount */}
            <Col span={12}>
              <Form.Item
                label="Insurance Amount"
                name="insuranceAmount"
                required
              >
                <InputNumber
                  defaultValue={0}
                  min={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            {/* Status */}
            <Col span={12}>
              <Form.Item label="Status" name="status" required>
                <Select placeholder="Select Status">
                  {statuses.map((status) => (
                    <Select.Option key={status} value={status}>
                      {status}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Currency */}
            <Col span={12}>
              <Form.Item label="Currency" name="currency" required>
                <Select placeholder="Select Currency">
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
              <Form.Item label="Sale Date" name="saleDate" required>
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
                  Add Sale
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Customer Modal */}
      <CustomerModal />

      {/* Product Modal */}
      <ProductModal />
    </div>
  );
};

export default AddNewSale;
