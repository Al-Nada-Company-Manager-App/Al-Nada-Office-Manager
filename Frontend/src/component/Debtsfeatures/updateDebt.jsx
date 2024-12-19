import React from "react";
import {
  Form,
  Select,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Modal,
  Upload,
  Col,
  Row,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDebts,
  setupdateDebtModalVisible,
  setDebtModalVisible,
  updateDebt,
} from "../../Store/Debts";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";

const UpdateDebtModal = () => {
  const { selectedDebt, updateDebtModalVisible } = useSelector(
    (state) => state.Debts
  );
  const dispatch = useDispatch();

  const handleUpdateDebt = async (values) => {
    const updatDate = {};

    updatDate["SL_ID"] = selectedDebt.sl_id;
    updatDate["D_ID"] = selectedDebt.d_id;
    updatDate["D_TYPE"] = selectedDebt.d_type;

    Object.entries(values).forEach(([key, value]) => (updatDate[key] = value));
  
    await dispatch(updateDebt(updatDate));
    dispatch(fetchDebts());
    dispatch(setupdateDebtModalVisible(false));
    dispatch(setDebtModalVisible(false));
  };

  const handleupdateClose = () => {
    dispatch(setupdateDebtModalVisible(false));
  };

  return (
    <div>
      <Modal
        title="Update Debt"
        open={updateDebtModalVisible}
        onCancel={() => handleupdateClose()}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleUpdateDebt}
          initialValues={{
            ...selectedDebt,
            d_date: selectedDebt?.d_date
              ? moment(selectedDebt.d_date)
              : null,
          }}
        >
          {/* Paid Amount */}
          <Col span={12}>
            <Form.Item
              label="Amount"
              name="d_amount"
              rules={[{ required: true, message: "Please enter amount" }]}
            >
              <InputNumber  style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Due Date"
              name="d_date"
              rules={[
                {
                  required: true,
                  message: "Please select a due date!",
                },
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
                Update Debt
              </Button>
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateDebtModal;
