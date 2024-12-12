import React from "react";
import { Form, Input, Button, Modal, Upload } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setselectedSalesModalVisible,setSelectedSale } from "../../Store/Sales";
import { fetchDebts, setaddDebtModalVisible, addDebt } from "../../Store/Debts";
import { DatePicker, InputNumber, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SaleModal from "./SalesModal";

const AddnewDebt = () => {
  const { addDebtModalVisible } = useSelector((state) => state.Debts);
  const { selectedSale } = useSelector((state) => state.Sales);
  const dispatch = useDispatch();

  const handleAddDebt = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );
    await dispatch(addDebt(formData));
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
            {/* Select Sale */}
            <Form.Item label="Select Sale" name="sale" required>
              <Button  onClick={openSalesModal}>
                {selectedSale ? `Sale: ${selectedSale.sl_id}` : "Select Sale"}
              </Button>
            </Form.Item>

            {/* Select Customer */}
            <Form.Item
              label="Select Customer"
              name="customer"
            >
              {selectedSale && (
                <Input defaultValue={selectedSale.c_name} readOnly />
              )}
            </Form.Item>

            {/* Debt Date */}
            <Form.Item
              label="Debt Date"
              name="d_date"
              rules={[
                { required: true, message: "Please select a debt date!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            {/* Debt Type */}
            <Form.Item
              label="Debt Type"
              name="d_type"
              rules={[{ required: true, message: "Please enter a debt type!" }]}
            >
              <Input placeholder="Enter debt type (e.g., Sales, Insurance)" />
            </Form.Item>

            {/* Debt Amount */}
            <Form.Item
              label="Debt Amount"
              name="d_amount"
              rules={[
                { required: true, message: "Please enter the debt amount!" },
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

            {/* Debt Currency */}
            <Form.Item
              label="Debt Currency"
              name="d_currency"
              rules={[{ required: true, message: "Please select a currency!" }]}
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

            {/* Submit Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        }
      </Modal>
      <SaleModal />
    </div>
  );
};

export default AddnewDebt;
