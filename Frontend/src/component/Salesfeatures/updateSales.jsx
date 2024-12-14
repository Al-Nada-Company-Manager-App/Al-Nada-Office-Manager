import React from "react";
import { Form, Select,Input,InputNumber, Button, Modal, Upload,Col,Row } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSales,
  setupdateSaleModalVisible,
  setSaleModalVisible,
  updateSale,
} from "../../Store/Sales";
import { UploadOutlined } from "@ant-design/icons";
const statuses = ["Pending", "Completed", "Canceled"];


const UpdateSaleModal = () => {
  const { selectedSale, updateSaleModalVisible } = useSelector(
    (state) => state.Sales
  );
  const dispatch = useDispatch();

  const handleUpdateSale = async (values) => {
    const updatDate ={};

    updatDate["SL_ID"] = selectedSale.sl_id;

    Object.entries(values).forEach(([key, value]) =>
      updatDate[key] = value
    );

    await dispatch(updateSale(updatDate));
    dispatch(fetchSales());
    dispatch(setupdateSaleModalVisible(false));
    dispatch(setSaleModalVisible(false));
    form.resetFields();
  };

  const handleupdateClose = () => {
    dispatch(setupdateSaleModalVisible(false));
  };

  return (
    <div>
      <Modal
        title="Update Sale"
        open={updateSaleModalVisible}
        onCancel={() => handleupdateClose()}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleUpdateSale}
          initialValues={selectedSale}
        >
          {/* Paid Amount */}
          <Col span={12}>
            <Form.Item
              label="Paid Amount"
              name="sl_payed"
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
              name="sl_inamount"
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
              name="sl_status"
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
          {/* Submit Button */}
          <Col span={24}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Update Sale
              </Button>
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateSaleModal;
