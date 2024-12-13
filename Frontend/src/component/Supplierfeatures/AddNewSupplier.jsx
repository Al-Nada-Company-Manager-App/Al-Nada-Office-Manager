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
// import SupplierModal from "./SupplierModal";
// import ProductModal from "./ProductModal";
import axios from "axios";


const AddNewSupplier = ({ handleFinish }) => {
  const [isSupplierModalVisible, setIsSupplierModalVisible] = useState(false);
 // const [selectedSupplier, setSelectedSupplier] = useState(null); ////
 // const [selectedProducts, setSelectedProducts] = useState([]);
  const [name, setName] = useState(0);
  const [address, setAddress] = useState(0);
  const [city, setCity] = useState(0);

  const [country, setCountry] = useState(0);
  const [zipcode, setZipcode] = useState(0);
  const [fax, setFax] = useState(0);
  const [phone, setPhone] = useState(0);
  const [email, setEmail] = useState(0);
//const [customsnum, setcustomsnum] = useState(0);

// Modal visibility states
//   const [isSupplierModalVisible, setIsSupplierModalVisible] = useState(false); ////
//   const [isProductModalVisible, setIsProductModalVisible] = useState(false);

   const openSupplierModal = () => setIsSupplierModalVisible(true);
   const closeSupplierModal = () => setIsSupplierModalVisible(false);

//const onSaleTypeChange = (value) => setPurchaseType(value);/// what mean

//   const openSupplierModal = () => setIsSupplierModalVisible(true); ///
//   const closeSupplierModal = () => setIsSupplierModalVisible(false); ////

//   const openProductModal = () => setIsProductModalVisible(true);
//   const closeProductModal = () => setIsProductModalVisible(false);

// const handleSelectSupplier = (supplier) => {
//   /////
//   setSelectedSupplier(supplier);
//   closeSupplierModal();
// };

// const handleSelectProducts = (products) => {
//   setSelectedProducts(products);
//   closeProductModal();
// };

  // const calculateTotal = () => {
  //   const calculatedTotal = cost + cost * (tax / 100);
  //   setTotal(calculatedTotal);
  // };
  // useEffect(() => {
  //   calculateTotal();
  //   console.log("Total:", Total);
  // }, [cost, tax]);

  const handleSupplierFinish = async (values) => {
    const supplierdata = {
      ...values,
    };
    console.log("Supplier Data:", supplierdata);
    try {
      handleFinish(supplierdata);
    } catch (error) {
      console.error("Error adding Supplier:", error);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={openSupplierModal}
        style={{
          marginBottom: "16px",
          backgroundColor: "#389e0d",
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
        }}
        icon={<PlusOutlined />}
      >
        Add Supplier
      </Button>
      <Modal
        title="Add New Purchase"
        open={isSupplierModalVisible}
        onCancel={closeSupplierModal}
        footer={[
          <Button key="close" onClick={closeSupplierModal}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <Form
          onFinish={(values) => {
            handleFinish(values);
            closeSupplierModal();
          }}
          layout="horizontal"
        >

            {/* Bill Number
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
            {/* <Col span={12}>
              <Form.Item label="Cost" name="cost" required>
                <InputNumber
                  value={cost || 0}
                  onChange={(value) => setCost(value)}
                  min={0}
                  style={{ width: "100%" }}
                  onBlur={calculateTotal}
                />
              </Form.Item>
            </Col> */}

            {/* Tax */}
            {/* <Col span={12}>
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
            </Col> */}

            {/* Total (Calculated) */}
            {/* <Col span={12}>
              <Form.Item label="Total" name="total" required>
                <InputNumber
                  value={Total}
                  placeholder={Total}
                  readOnly
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col> */}

            {/* Currency */}
            {/* <Col span={12}>
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
            </Col> */}

            {/* Sale Date */}
            {/* <Col span={12}>
              <Form.Item label="Purchase Date" name="purshasedate" required>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col> } */}

            {/* Submit Button */}
            {/* <Col span={24}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Add Purchase
                </Button>
              </Form.Item>
            </Col> */}
        </Form>
      </Modal>

     
    </div>
  );
};

export default AddNewSupplier;
