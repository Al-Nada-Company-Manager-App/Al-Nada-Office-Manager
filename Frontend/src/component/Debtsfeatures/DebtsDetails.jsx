import React from "react";
import { Modal, Button, Row, Col } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  setDebtModalVisible,
  setselectedDebt,
  setupdateDebtModalVisible,
  deleteDebt,
  fetchDebts,
} from "../../Store/Debts";
import { convertTimestampToDate } from "../../utils/ConvertDate";
import UpdateDebtModal from "./updateDebt";
const DebtDetails = () => {
  const dispatch = useDispatch();
  const { userAccess } = useSelector((state) => state.auth);
  const { selectedDebt, DebtModalVisible } = useSelector(
    (state) => state.Debts
  );
  const handleModalClose = () => {
    dispatch(setDebtModalVisible(false));
    dispatch(setselectedDebt(null));
  };
  const handleDelete = async () => {
    await dispatch(deleteDebt(selectedDebt.d_id));
    dispatch(fetchDebts());
    handleModalClose();
  };
  const handleActivateDebt = () => {
    dispatch(setupdateDebtModalVisible(true));
  };
  return (
    <>
      <Modal
        title="Debts Details"
        centered
        open={DebtModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
          userAccess.debts_delete && (
            <Button
              key="delete"
              onClick={handleDelete}
              type="primary"
              danger
            >
              Delete Debt
            </Button>
          ),
        ]}
        width={800}
      >
        {selectedDebt && (
          <div>
            <Row gutter={16}>
              <Col span={8}>
                {/* Placeholder for Sale Image */}
                <img
                  src={
                    selectedDebt.c_photo
                      ? "./Customers/" + selectedDebt.c_photo
                      : "https://via.placeholder.com/150"
                  }
                  alt={selectedDebt.c_name}
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
                <p>
                  <strong>Customer Name:</strong> {selectedDebt.c_name}
                </p>
              </Col>
              <Col span={16}>
                <div>
                  <p>
                    <strong>Sale ID:</strong> {selectedDebt.sl_id}
                  </p>
                  <p>
                    <strong>Debts Due Date:</strong>{" "}
                    {convertTimestampToDate(selectedDebt.d_date)}
                  </p>
                  <p>
                    <strong>Debt Type:</strong> {selectedDebt.d_type}
                  </p>
                  <p>
                    <strong>Debt Amount:</strong>{" "}
                    {selectedDebt.d_amount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Currency:</strong> {selectedDebt.d_currency}
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
      <UpdateDebtModal />
    </>
  );
};

export default DebtDetails;
