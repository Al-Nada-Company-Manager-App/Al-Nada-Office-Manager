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
import {
  setSelectedCustomerModalVisible,
  setSelectedCustomer,
} from "../../Store/Customer";
import {
  setSelectedProductModalVisible,
  setSelectedProduct,
  fetchProducts,
} from "../../Store/Product";
import AddnewUnderMaintenance from "../RepairProductfeatures/AddnewUnderMaintenance";

const statuses = ["Pending", "Completed", "Canceled"];
const currencies = ["USD", "EUR", "EGP"];

const AddNewSale = () => {
  const dispatch = useDispatch();
  const { saleType, addSaleModalVisible } = useSelector((state) => state.Sales);
  const { selectedCustomer } = useSelector((state) => state.Customers);
  const { selectedProducts } = useSelector((state) => state.Products);
  const [cost, setCost] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [showDueDate, setShowDueDate] = useState(false);
  const [showInsuranceDueDate, setShowInsuranceDueDate] = useState(false);

  const [form] = Form.useForm();

  const handleValuesChange = (changedValues, allValues) => {
    const { paidAmount, insuranceAmount } = allValues;

    if (paidAmount !== undefined) {
      setShowDueDate(paidAmount !== total);
    }

    if (insuranceAmount !== undefined) {
      setShowInsuranceDueDate(insuranceAmount > 0);
    }
  };

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
  React.useEffect(() => {
    const calculatecost = () => {
      let cost = 0;
      selectedProducts.forEach((product) => {
        cost += product.totalCost;
      });
      setCost(cost);
    };
    calculatecost();
  }, [selectedProducts]);

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

  const handleaddDum = async (values) => {
    try {
      console.log("DUM data:", values);

      const payload = {
        serialnumber: values.serialnumber,
        productname: values.productname,
        //category: values.category,
        maintenanceStatus: values.maintenanceStatus,
      };

      console.log("Constructed payload:", payload);

      const response = await axios.post(
        "http://localhost:4000/AddDUM",
        payload
      );

      if (response.data.success) {
        console.log("Device Under Maintenance added successfully");
      } else {
        console.error(
          "Error while adding Device Under Maintenance:",
          response.data.message
        );
      }

      return true;
    } catch (error) {
      console.error("Error in handleDeviceUnderMaintenace:", error.message);
      console.log("errrrrror");
      return false;
    }
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
          onValuesChange={handleValuesChange}
        >
          <Row gutter={16}>
            {/* Sale Type */}
            <Col span={24}>
              <Form.Item
                label="Sale Type"
                name="saleType"
                rules={[
                  { required: true, message: "Please select a sale type!" },
                ]}
              >
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
              <Form.Item
                label="Select Customer"
                name="customer"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!selectedCustomer) {
                        return Promise.reject(
                          new Error("Please select a customer!")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
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
                <Form.Item
                  label="Select Product"
                  name="product"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!selectedCustomer) {
                          return Promise.reject(
                            new Error("Please select a customer!")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Button onClick={openProductModal}>
                    {Array.isArray(selectedProducts) &&
                    selectedProducts.length > 0
                      ? `${selectedProducts.length} Products Selected`
                      : "Select Products"}
                  </Button>
                </Form.Item>
              </Col>
            )}
            {saleType === "REPAIR" && (
              <Col span={19}>
                <Form.Item
                  label="Add Devices needing Maintenance"
                  name="customer"
                >
                    <AddnewUnderMaintenance handleFinish={handleaddDum} />
                </Form.Item>
              </Col>
            )}

            {/* Bill Number */}
            <Col span={24}>
              <Form.Item
                label="Bill Number"
                name="billNumber"
                rules={[
                  { required: true, message: "Please enter a bill number!" },
                ]}
              >
                <Input defaultValue={0} />
              </Form.Item>
            </Col>

            {/* Cost */}
            <Col span={12}>
              <Form.Item
                label="Cost"
                name="cost"
                rules={[{ required: true, message: "Please enter the cost!" }]}
              >
                <InputNumber
                  placeholder={cost}
                  min={0}
                  style={{ width: "100%" }}
                  onChange={(value) => setCost(value)}
                />
              </Form.Item>
            </Col>

            {/* Discount */}
            <Col span={12}>
              <Form.Item
                label="Discount (%)"
                name="discount"
                rules={[
                  { required: true, message: "Please enter the discount!" },
                ]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                  onChange={(value) => setDiscount(value)}
                />
              </Form.Item>
            </Col>

            {/* Tax */}
            <Col span={12}>
              <Form.Item
                label="Tax (%)"
                name="tax"
                rules={[
                  {
                    required: true,
                    message: "Please enter the tax percentage!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                  onChange={(value) => setTax(value)}
                />
              </Form.Item>
            </Col>

            {/* Total */}
            <Col span={12}>
              <Form.Item
                label="Total"
                rules={[
                  { required: true, message: "Total amount is required!" },
                ]}
              >
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
              <Form.Item
                label="Paid Amount"
                name="paidAmount"
                rules={[
                  { required: true, message: "Please enter the paid amount!" },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            {/* Insurance Amount */}
            <Col span={12}>
              <Form.Item
                label="Insurance Amount"
                name="insuranceAmount"
                rules={[
                  {
                    required: true,
                    message: "Please enter the insurance amount!",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            {/* Status */}
            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select a status!" }]}
              >
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
              <Form.Item
                label="Currency"
                name="currency"
                rules={[
                  { required: true, message: "Please select a currency!" },
                ]}
              >
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
              <Form.Item
                label="Sale Date"
                name="saleDate"
                rules={[
                  { required: true, message: "Please select a sale date!" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            {/* Due Date */}
            {showDueDate && (
              <Col span={12}>
                <Form.Item
                  label="Remain Due Date"
                  name="dueDate"
                  rules={[
                    { required: true, message: "Please select a due date!" },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            )}

            {/* Insurance Due Date */}
            {showInsuranceDueDate && (
              <Col span={12}>
                <Form.Item
                  label="Insurance Due Date"
                  name="insuranceDueDate"
                  rules={[
                    {
                      required: true,
                      message: "Please select an insurance due date!",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            )}

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
