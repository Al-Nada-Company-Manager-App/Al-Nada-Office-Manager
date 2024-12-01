import React from "react";
import { Modal, Button, Row, Col } from 'antd';


const CustomerDetails = ({ selectedCustomer, isModalVisible, handleModalClose, handleDeleteUse }) => {


    return (
        <> {selectedCustomer && (
            <Modal
            title="Customer Details"
            centered
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={[
              <Button key="close" onClick={handleModalClose}>
                Close
              </Button>,
            ]}
            width={800} // Increased modal width
          >
            {selectedUser && (
              <div>
                <Row gutter={16}>
                  {/* Employee Image on the left */}
                  <Col span={8}>
                    <img
                      src={selectedUser.e_photo || 'https://via.placeholder.com/150'}
                      alt={`${selectedUser.f_name} ${selectedUser.l_name}`}
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        maxHeight: '300px', 
                        marginTop: '16px',
                        marginBottom: '16px',
                      }}
                    />
                    <div className="Customer-actions">
                      <Button className='Customer-actions-btn'
                      key="deleteCustomer" onClick={handleDeleteCustomer(selectedCustomer.e_id)} type="primary" danger>
                          Delete Customer
                      </Button>
                      {selectedCustomer.e_active === true ? (
                      <Button className='Customer-actions-btn'
                       key="deactivateCustomer" onClick={handledeactivateCustomer(selectedCustomer.e_id)} danger>
                          Deactivate Customer
                      </Button>
                      ) : (
                      <Button className='Customer-actions-btn'
                       key="activateCustomer" onClick={handleactivateCustomer(selectedCustomer.e_id)} type="primary" >
                          Activate Customer
                      </Button>
                      )}
                    </div>
                  </Col>
      
                  {/* Employee Details on the right */}
                  <Col span={16}>
                  <div className="Customer-details">
                    <p><strong>Name:</strong> {selectedCustomer.C_NAME}</p>
                    <p><strong>Address:</strong> {selectedCustomer.C_ADDRESS}</p>
                    <p><strong>City:</strong> {selectedCustomer.C_CITY}</p>
                    <p><strong>ZIP CODE:</strong> {selectedCustomer.C_ZIPCODE}</p>
                    <p><strong>Fax:</strong> {selectedCustomer.C_FAX}</p>
                  </div>
                 </Col>
                </Row>
      
                {/* Additional Information */}
                <Row gutter={16} style={{ marginTop: '16px' }}>
                  <Col span={24}>
                   
                  </Col>
                </Row>
              </div>
            )}
          </Modal>
       
        )}</>
       
    );
};
export default CustomerDetails