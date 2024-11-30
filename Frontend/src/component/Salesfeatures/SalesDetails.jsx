import React from "react";
import { Modal, Button, Row, Col } from 'antd';


const SaleDetails = ({ selectedSale, isModalVisible, handleModalClose, handleDeleteSale, handleActivateSale, handleDeactivateSale }) => {
  console.log(selectedSale);
  return (
      <Modal
          title="Sale Details"
          centered
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={[
              <Button key="close" onClick={handleModalClose}>
                  Close
              </Button>,
              <Button key="delete" onClick={() => handleDeleteSale(selectedSale.sl_id)} type="primary" danger>
                  Delete Sale
              </Button>,
              <Button key='set status' onClick={() => handleActivateSale(selectedSale.sl_id)} type="primary">
                  Set Status
              </Button>,
              
              
          ]}
          width={800}
      >
          {selectedSale && (
              <div>
                  <Row gutter={16}>
                      <Col span={8}>
                          {/* Placeholder for Sale Image */}
                          <img
                              src={selectedSale.c_photo || 'https://via.placeholder.com/150'}
                              alt={selectedSale.c_name}
                              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                          />
                          <p><strong>Customer Name:</strong> {selectedSale.c_name}</p>

                      </Col>
                      <Col span={16}>
                          <div>
                              <p><strong>Sale ID:</strong> {selectedSale.sl_id}</p>
                              <p><strong>Bill Number:</strong> {selectedSale.sl_billnum}</p>
                              <p><strong>Sale Date:</strong> {new Date(selectedSale.sl_date).toLocaleDateString()}</p>
                              <p><strong>Cost:</strong> {selectedSale.sl_cost}</p>
                              <p><strong>Discount:</strong> {selectedSale.sl_discount}</p>
                              <p><strong>Tax:</strong> {selectedSale.sl_tax}</p>
                              <p><strong>Total:</strong> {selectedSale.sl_total}</p>
                              <p><strong>Payed: </strong>{selectedSale.sl_payed}</p>
                              <p><strong>Insurance Amount: </strong>{selectedSale.sl_inamount}</p>
                              <p><strong>Type: </strong>{selectedSale.sl_type}</p>
                              <p><strong>Status:</strong> {selectedSale.sl_status}</p>
                              <p><strong>Currency:</strong> {selectedSale.sl_currency}</p>
                          </div>
                      </Col>
                  </Row>
              </div>
          )}
      </Modal>
  );
};

export default SaleDetails;