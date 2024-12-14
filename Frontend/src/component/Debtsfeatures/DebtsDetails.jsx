import React from "react";
import { Modal, Button, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDebtModalVisible,setselectedDebt } from "../../Store/Debts";
const DebtDetails = () => {
    const dispatch = useDispatch();
    const { selectedDebt, DebtModalVisible } = useSelector((state) => state.Debts);
    const handleModalClose = () => {
        dispatch(setDebtModalVisible(false));
        dispatch(setselectedDebt(null));
      };
    
    
  return (
      <Modal
          title="Debts Details"
          centered
          open={DebtModalVisible}
          onCancel={handleModalClose}
          footer={[
              <Button key="close" onClick={handleModalClose}>
                  Close
              </Button>,
              <Button key='set status' onClick={() => handleActivateSale(selectedDebt.sl_id)} type="primary">
                  Set Status
              </Button>,
              
              
          ]}
          width={800}
      >
          {selectedDebt && (
              <div>
                  <Row gutter={16}>
                      <Col span={8}>
                          {/* Placeholder for Sale Image */}
                          <img
                              src={selectedDebt.c_photo || 'https://via.placeholder.com/150'}
                              alt={selectedDebt.c_name}
                              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                          />
                          <p><strong>Customer Name:</strong> {selectedDebt.c_name}</p>

                      </Col>
                      <Col span={16}>
                          <div>
                              <p><strong>Sale ID:</strong> {selectedDebt.sl_id}</p>
                              <p><strong>Debts Due Date:</strong> {selectedDebt.d_date}</p>
                              <p><strong>Debt Type:</strong> {new Date(selectedDebt.d_type).toLocaleDateString()}</p>
                              <p><strong>Debt Amount:</strong> {selectedDebt.d_amount}</p>
                              <p><strong>Currency:</strong> {selectedDebt.d_currency}</p>
                          </div>
                      </Col>
                  </Row>
              </div>
          )}
      </Modal>
  );
};

export default DebtDetails;