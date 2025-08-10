import React from "react";
import {
  Form,
  Select,
  Input,
  InputNumber,
  Button,
  Modal,
  Upload,
  Col,
  Row,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import ProductModal from "./ProductModal";
import {
  fetchPurchases,
  updatePurchase,
  setupdatePurchaseModalVisible,
  setPurchaseModalVisible,
  setSelectedPurchase,
} from "../../Store/Purchase";
import { setSelectedProductModalVisible } from "../../Store/Product";
import { UploadOutlined } from "@ant-design/icons";
const statuses = ["Pending", "Completed", "Canceled"];

const UpdatePurchaseModal = () => {
  const { selectedpurchase, updatePurchaseModalVisible } = useSelector(
    (state) => state.Purchases
  );
  const { selectedProducts } = useSelector((state) => state.Products);
  const dispatch = useDispatch();

  const handleUpdatePurchase = async (values) => {
    const updatDate = {};

    updatDate["PCH_ID"] = selectedpurchase.pch_id;

    Object.entries(values).forEach(([key, value]) => (updatDate[key] = value));
    updatDate["total"] =
      values.cost +
      (values.cost * values.tax) / 100 +
      values.expense +
      values.customscost;
    updatDate["products"] = selectedProducts;

    await dispatch(updatePurchase(updatDate));
    dispatch(fetchPurchases());
    dispatch(setupdatePurchaseModalVisible(false));
    dispatch(setPurchaseModalVisible(false));
    dispatch(setSelectedPurchase(null));
  };

  const handleupdateClose = () => {
    dispatch(setupdatePurchaseModalVisible(false));
  };
  const openProductModal = () => dispatch(setSelectedProductModalVisible(true));

  return (
    <div>
      <Modal
        title="Update Sale"
        open={updatePurchaseModalVisible}
        onCancel={() => handleupdateClose()}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleUpdatePurchase}
          initialValues={selectedpurchase}
        >
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
                    Array.isArray(selectedProducts) &&
                    selectedProducts.length > 0
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

          {/* Cost */}
          <Col span={12}>
            <Form.Item
              label="Cost"
              name="cost"
              rules={[
                { required: true, message: "Cost is required." },
                {
                  type: "number",
                  min: 0,
                  message: "Cost must be a non-negative value.",
                },
              ]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
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
              <InputNumber min={0} max={100} style={{ width: "100%" }} />
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
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          {/* Expense */}
          <Col span={12}>
            <Form.Item
              label="Expense"
              name="expense"
              rules={[
                { required: true, message: "Expense is required." },
                {
                  type: "number",
                  min: 0,
                  message: "Expense must be a non-negative value.",
                },
              ]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
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
                Update Purchase
              </Button>
            </Form.Item>
          </Col>
        </Form>
        <ProductModal />
      </Modal>
    </div>
  );
};

export default UpdatePurchaseModal;
