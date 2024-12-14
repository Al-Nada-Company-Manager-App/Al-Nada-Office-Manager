import React from "react";
import { Form, Input, Row, Col, Button, Modal, Upload } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  setselectedSalesModalVisible,
  setSelectedSale,
} from "../../Store/Sales";
import { fetchDebts, setaddDebtModalVisible, addDebt } from "../../Store/Debts";
import { DatePicker, InputNumber, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SaleModal from "./SalesModal";

const AddnewDebt = () => {
  const { addDebtModalVisible } = useSelector((state) => state.Debts);
  const { selectedSale } = useSelector((state) => state.Sales);
  const dispatch = useDispatch();

  const handleAddDebt = async (values) => {
    const debtData = {};

    Object.entries(values).forEach(([key, value]) => (debtData[key] = value));
    debtData["sl_id"] = selectedSale.sl_id;

    await dispatch(addDebt(debtData));
    dispatch(fetchDebts());
    handleaddClose();
  };
  const [form] = Form.useForm();

  const handleaddClose = () => {
    dispatch(setaddDebtModalVisible(false));
    form.resetFields();
    dispatch(setSelectedSale(null));
  };
  const openSalesModal = () => {
    dispatch(setselectedSalesModalVisible(true));
  };

  const openAddModal = () => {
    dispatch(setaddDebtModalVisible(true));
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={openAddModal}
        style={{
          marginBottom: "16px",
          backgroundColor: "#389e0d",
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
        }}
        icon={<PlusOutlined />}
      >
        Add Debts
      </Button>
      <Modal
        title="Add Debt"
        open={addDebtModalVisible}
        onCancel={() => handleaddClose()}
        footer={null}
      >
        {
          <Form form={form} layout="vertical" onFinish={handleAddDebt}>
            <Row gutter={[16, 16]}>
              {/* Select Sale */}
              <Col span={24}>
                <Form.Item label="Select Sale" required>
                  <Button onClick={openSalesModal} style={{ width: "100%" }}>
                    {selectedSale
                      ? `Sale: ${selectedSale.sl_id}`
                      : "Select Sale"}
                  </Button>
                </Form.Item>
              </Col>

              {/* Debt Date */}
              <Col span={12}>
                <Form.Item
                  label="Debt Date"
                  name="d_date"
                  rules={[
                    { required: true, message: "Please select a debt date!" },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              {/* Debt Type */}
              <Col span={12}>
                <Form.Item
                  label="Debt Type"
                  name="d_type"
                  rules={[
                    { required: true, message: "Please enter a debt type!" },
                  ]}
                >
                  <Select
                    placeholder="Select a Debt Type"
                    options={[
                      { label: "Debt In", value: "Debt_In" },
                      { label: "Debt Out", value: "Debt_Out" },
                      { label: "Insurance", value: "Insurance" },
                    ]}
                  />
                </Form.Item>
              </Col>

              {/* Debt Amount */}
              <Col span={12}>
                <Form.Item
                  label="Debt Amount"
                  name="d_amount"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the debt amount!",
                    },
                    {
                      type: "number",
                      message: "Amount must be a number!",
                      transform: (value) => Number(value),
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Enter debt amount"
                  />
                </Form.Item>
              </Col>

              {/* Debt Currency */}
              <Col span={12}>
                <Form.Item
                  label="Debt Currency"
                  name="d_currency"
                  rules={[
                    { required: true, message: "Please select a currency!" },
                  ]}
                >
                  <Select
                    placeholder="Select a Currency"
                    options={[
                      { label: "USD", value: "USD" },
                      { label: "EUR", value: "EUR" },
                      { label: "EGP", value: "EGP" },
                    ]}
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
                    Submit
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        }
      </Modal>
      <SaleModal />
    </div>
  );
};

export default AddnewDebt;
