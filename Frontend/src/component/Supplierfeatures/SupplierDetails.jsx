import React from "react";
import { Modal, Button, Row, Col } from 'antd';
const SupplierDetails = ({ selectedsupplier, isModalVisible, handleModalClose, handleDeleteSupplier,handleUpdateSupplier}) => {
  return (
      <Modal
          title="Supplier Details"
          centered
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={[
              <Button key="close" onClick={handleModalClose}>
                  Close
              </Button>,
              <Button key="Delete Supplier" onClick={() => handleDeleteSupplier(selectedsupplier.s_id)  } type="primary" danger >
                  Delete Purchase
              </Button>,
              <Button key='Update Supplier' onClick={() => handleDeleteSupplier(selectedsupplier.s_id)}  type="primary">
                  Update Purchase
              </Button>,
          ]}
          width={800}
      >
          {selectedsupplier && (
              <div>
                  <Row gutter={16}>
                       <Col span={8}>
                          <img
                              src={selectedsupplier.s_photo || 'https://via.placeholder.com/150'}
                              alt={selectedsupplier.s_name}
                              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                          />
                      </Col> 
                      <Col span={16}>
                          <div>
                              <p><strong>Supplier Name:</strong> {selectedsupplier.s_name}</p>
                              <p><strong>Supplier Address:</strong> {selectedsupplier.s_address}</p>
                              <p><strong>Supplier City:</strong> {selectedsupplier.s_city}</p>
                              <p><strong>Supplier Country:</strong> {selectedsupplier.s_country}</p>
                              <p><strong>ZipCode:</strong> {selectedsupplier.s_zipcode}</p>
                              <p><strong>Fax: </strong>{selectedsupplier.s_fax}</p>
                              
                          </div>
                      </Col>
                  </Row>
              </div>
          )}
      </Modal>
  );
};
export default SupplierDetails;