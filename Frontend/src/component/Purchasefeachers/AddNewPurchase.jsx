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
import ProductModal from "./ProductModal"
import axios from "axios";
import {useDispatch,useSelector} from "react-redux";
import {fetchPurchases ,deletePurchase,setSelectedPurchase ,addPurchase,setPurchaseModalVisible,setaddPurchaseModalVisible } from "../../Store/Purchase";
import { setSelectedProductModalVisible,setSelectedProduct,fetchProducts } from "../../Store/Product";
import { setSelectedSupplier,setSelectSupplierModalVisible } from "../../Store/Supplier";
const currencies = ["USD", "EUR", "EGP"];

const AddNewPurchase = () => {
  const dispatch = useDispatch();
  const {addPurchaseModalVisible} = useSelector((state) => state.Purchases);
  const { selectedSupplier } = useSelector((state) => state.Suppliers);
  const { selectedProducts } = useSelector((state) => state.Products);
  const [cost, setCost] = useState(0);


  const [tax, setTax] = useState(0);
  const [Total, setTotal] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [expense, setexpense] = useState(0);
  const [customscost, setcustomscost] = useState(0);

  // Modal visibility states
  const [isSupplierModalVisible, setIsSupplierModalVisible] = useState(false); ////

  const openParchaseModal = () => dispatch(setaddPurchaseModalVisible(true));
  const closeSParchaseModal = () => dispatch(setaddPurchaseModalVisible(false));

  //const onSaleTypeChange = (value) => setPurchaseType(value);/// what mean

  const openSupplierModal = () => dispatch(setSelectSupplierModalVisible(true)); //// 
  const closeSupplierModal = () => dispatch(setSelectSupplierModalVisible(false));////

  const openProductModal = () => dispatch(setSelectedProductModalVisible(true));

  const calculateTotal = () => {
    const calculatedTotal = cost + cost * (tax / 100)+expense+customscost;
    setTotal(calculatedTotal);
  };
  useEffect(() => {
    calculateTotal();
  }, [cost, tax,expense,customscost]);

  const handlePurchaseFinish = async (values) => {
    const purchasedata = {
      ...values,
      supplier: selectedSupplier,
      products: selectedProducts,
      total: Total,
    };
    await dispatch(addPurchase(purchasedata));
    dispatch(fetchPurchases());
    closeSParchaseModal();
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
        Add Purchase
      </Button>
      <Modal
        title="Add New Purchase"
        open={addPurchaseModalVisible}
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
    {/* Supplier Selection */}
    <Col span={24}>
      <Form.Item
        label="Select Supplier"
        name="supplier"
        rules={[
          {
            required: true,
            message: "Please select a supplier.",
            validator: (_, value) =>
              selectedSupplier ? Promise.resolve() : Promise.reject("Please select a supplier."),
          },
        ]}
      >
        <Button onClick={openSupplierModal}>
          {selectedSupplier ? selectedSupplier.s_name : "Select Supplier"}
        </Button>
      </Form.Item>
    </Col>

    {/* Product Selection */}
    <Col span={24}>
      <Form.Item
        label="Select Product"
        name="product"
        rules={[
          {
            required: true,
            message: "Please select at least one product.",
            validator: (_, value) =>
              Array.isArray(selectedProducts) && selectedProducts.length > 0
                ? Promise.resolve()
                : Promise.reject("Please select at least one product."),
          },
        ]}
      >
        <Button onClick={openProductModal}>
          {Array.isArray(selectedProducts) && selectedProducts.length > 0
            ? `${selectedProducts.length} Products Selected`
            : "Select Products"}
        </Button>
      </Form.Item>
    </Col>

    {/* Bill Number */}
    <Col span={12}>
      <Form.Item
        label="Bill Number"
        name="billNumber"
        rules={[
          { required: true, message: "Bill number is required." },
          { type: "string", message: "Bill number must be a valid string." },
        ]}
      >
        <Input defaultValue={0} />
      </Form.Item>
    </Col>

    {/* Expense */}
    <Col span={12}>
      <Form.Item
        label="Expense"
        name="expense"
        rules={[
          { required: true, message: "Expense is required." },
          { type: "number", min: 0, message: "Expense must be non-negative." },
        ]}
      >
        <InputNumber
          onChange={(value) => setexpense(value)}
          min={0}
          style={{ width: "100%" }}
        />
      </Form.Item>
    </Col>

    {/* Customs Cost */}
    <Col span={12}>
      <Form.Item
        label="Customs Cost"
        name="customscost"
        rules={[
          { required: true, message: "Customs cost is required." },
          {
            type: "number",
            min: 0,
            message: "Customs cost must be a non-negative value.",
          },
        ]}
      >
        <InputNumber
          onChange={(value) => setcustomscost(value)}
          min={0}
          style={{ width: "100%" }}
        />
      </Form.Item>
    </Col>

    {/* Customs Number */}
    <Col span={12}>
      <Form.Item
        label="Customs Num"
        name="customsnum"
        rules={[
          { required: true, message: "Customs number is required." },
          {
            type: "number",
            min: 0,
            message: "Customs number must be a non-negative value.",
          },
        ]}
      >
        <InputNumber
          min={0}
          style={{ width: "100%" }}
        />
      </Form.Item>
    </Col>

    {/* Cost */}
    <Col span={12}>
      <Form.Item
        label="Cost"
        name="cost"
        rules={[
          { required: true, message: "Cost is required." },
          { type: "number", min: 0, message: "Cost must be non-negative." },
        ]}
      >
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
      <Form.Item
        label="Tax (%)"
        name="tax"
        rules={[
          { required: true, message: "Tax is required." },
          {
            type: "number",
            min: 0,
            max: 100,
            message: "Tax must be between 0 and 100.",
          },
        ]}
      >
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
      <Form.Item
        label="Total"
        rules={[
          { required: true, message: "Total is required." },
        ]}
      >
        <InputNumber
          value={Total}
          readOnly
          style={{ width: "100%" }}
        />
      </Form.Item>
    </Col>

    {/* Currency */}
    <Col span={12}>
      <Form.Item
        label="Currency"
        name="currency"
        rules={[
          { required: true, message: "Currency is required." },
        ]}
      >
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

    {/* Purchase Date */}
    <Col span={12}>
      <Form.Item
        label="Purchase Date"
        name="purshasedate"
        rules={[
          { required: true, message: "Purchase date is required." },
        ]}
      >
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
      <SupplierModal/>

      {/* Product Modal */}
      <ProductModal/>
    </div>
  );
};

export default AddNewPurchase;
