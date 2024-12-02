import React from "react";
import { Modal, Button, Row, Col } from 'antd';


const PurchaseDetails = ({ selectedPurchase, isModalVisible, handleModalClose, handleDeletePurchase,handleUpdatePurchase}) => {
  return (
      <Modal
          title="Purchase Details"
          centered
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={[
              <Button key="close" onClick={handleModalClose}>
                  Close
              </Button>,
              <Button key="Delete Purchase" onClick={() => handleDeletePurchase(selectedPurchase.pch_id)  } type="primary" danger >
                  Delete Purchase
              </Button>,
              <Button key='Update Purchase' onClick={() => handleUpdatePurchase(selectedPurchase.pch_id)}  type="primary">
                  Update Purchase
              </Button>,
              
              
          ]}
          width={800}
      >
          {selectedPurchase && (
              <div>
                  <Row gutter={16}>
                      <Col span={8}>
                          {/* Placeholder for Sale Image */}
                          <img
                              src={selectedPurchase.s_photo || 'https://via.placeholder.com/150'}
                              alt={selectedPurchase.s_name}
                              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                          />
                          <p><strong>Customer Name:</strong> {selectedPurchase.s_name}</p>

                      </Col>
                      <Col span={16}>
                          <div>
                              <p><strong>Purchase ID:</strong> {selectedPurchase.pch_id}</p>
                              <p><strong>Bill Number:</strong> {selectedPurchase.pch_billnum}</p>
                              <p><strong>Sale Date:</strong> {new Date(selectedPurchase.pch_date).toLocaleDateString()}</p>
                              <p><strong>Cost:</strong> {selectedPurchase.pch_cost}</p>
                              <p><strong>Tax:</strong> {selectedPurchase.pch_tax}</p>
                              <p><strong>Total:</strong> {selectedPurchase.pch_total}</p>
                              <p><strong>CustomsNum: </strong>{selectedPurchase.pch_customsnum}</p>
                              <p><strong>CustomsCost: </strong>{selectedPurchase.pch_customscost}</p>
                              <p><strong>Expense:</strong> {selectedPurchase.pch_expense}</p>
                              <p><strong>Currency:</strong> {selectedPurchase.pch_currency}</p>
                          </div>
                      </Col>
                  </Row>
              </div>
          )}
      </Modal>
  );
};

export default PurchaseDetails;