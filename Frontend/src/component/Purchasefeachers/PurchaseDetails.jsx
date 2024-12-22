import React from "react";
import { Modal, Button, Row, Col } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPurchases,
  setupdatePurchaseModalVisible,
  deletePurchase,
  setSelectedPurchase,
  setPurchaseModalVisible,
} from "../../Store/Purchase";
import UpdatePurchaseModal from "./UpadatePurchase";
const PurchaseDetails = () => {
  const dispatch = useDispatch();
  const { selectedpurchase, PurchaseModalVisible } = useSelector(
    (state) => state.Purchases
  );
  const { userAccess } = useSelector((state) => state.auth);

  const handleModalClose = () => {
    dispatch(setPurchaseModalVisible(false));
    dispatch(setSelectedPurchase(null));
  };
  const handleDeletePurchase = async (id) => {
    await dispatch(deletePurchase(id));
    dispatch(fetchPurchases());
    dispatch(setSelectedPurchase(null));
    dispatch(setPurchaseModalVisible(false));
  };
  const handleUpdatePurchase = () => {
    dispatch(setupdatePurchaseModalVisible(true));
  };

  return (
    <>
      <Modal
        title="Purchase Details"
        centered
        open={PurchaseModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
          userAccess.purchase_delete && (
            <Button
              key="Delete Purchase"
              onClick={() => handleDeletePurchase(selectedpurchase.pch_id)}
              type="primary"
              danger
            >
              Delete Purchase
            </Button>
          ),
          userAccess.purchase_edit && (
            <Button
              key="Update Purchase"
              onClick={() => handleUpdatePurchase()}
              type="primary"
            >
              Update Purchase
            </Button>
          ),
        ]}
        width={800}
      >
        {selectedpurchase && (
          <div>
            <Row gutter={16}>
              <Col span={8}>
                {/* Placeholder for Sale Image */}
                <img
                  src={
                    selectedpurchase.s_photo
                      ? "./Suppliers/" + selectedpurchase.s_photo
                      : "https://via.placeholder.com/150"
                  }
                  alt={selectedpurchase.s_name}
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
                <p>
                  <strong>Customer Name:</strong> {selectedpurchase.s_name}
                </p>
              </Col>
              <Col span={16}>
                <div>
                  <p>
                    <strong>Purchase ID:</strong> {selectedpurchase.pch_id}
                  </p>
                  <p>
                    <strong>Bill Number:</strong> {selectedpurchase.pch_billnum}
                  </p>
                  <p>
                    <strong>Sale Date:</strong>{" "}
                    {new Date(selectedpurchase.pch_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Cost:</strong> {selectedpurchase.pch_cost}
                  </p>
                  <p>
                    <strong>Tax:</strong> {selectedpurchase.pch_tax}
                  </p>
                  <p>
                    <strong>Total:</strong> {selectedpurchase.pch_total}
                  </p>
                  <p>
                    <strong>CustomsNum: </strong>
                    {selectedpurchase.pch_customsnum}
                  </p>
                  <p>
                    <strong>CustomsCost: </strong>
                    {selectedpurchase.pch_customscost}
                  </p>
                  <p>
                    <strong>Expense:</strong> {selectedpurchase.pch_expense}
                  </p>
                  <p>
                    <strong>Currency:</strong> {selectedpurchase.pch_currency}
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
      <UpdatePurchaseModal />
    </>
  );
};

export default PurchaseDetails;
