import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Table } from "antd";

const CustomerDetails = ({
  selectedCustomer,
  isModalVisible,
  handleModalClose,
}) => {
  const [salesHistory, setSalesHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCustomer) {
      fetchSalesHistory(selectedCustomer.C_ID);
    }
  }, [selectedCustomer]);

  const fetchSalesHistory = async (customerId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/getCustomerSales/${customerId}`
      );
      setSalesHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch sales history:", error);
    } finally {
      setLoading(false);
    }
  };

  const salesColumns = [
    {
      title: "Date",
      dataIndex: "SL_DATE",
      key: "SL_DATE",
    },
    {
      title: "Total",
      dataIndex: "SL_TOTAL",
      key: "SL_TOTAL",
    },
    {
      title: "Discount",
      dataIndex: "SL_DISCOUNT",
      key: "SL_DISCOUNT",
    },
    {
      title: "Tax",
      dataIndex: "SL_TAX",
      key: "SL_TAX",
    },
    {
      title: "Status",
      dataIndex: "SL_STATUS",
      key: "SL_STATUS",
    },
    {
      title: "Bill Number",
      dataIndex: "SL_BILLNUM",
      key: "SL_BILLNUM",
    },
  ];

  return (
    <>
      {selectedCustomer && (
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
          width={800}
        >
          <Row gutter={16}>
            {/* Customer Details */}
            <Col span={8}>
              <img
                src={`http://localhost:4000/uploads/${selectedCustomer.c_name|| "placeholder"}.jpg`}
                alt={selectedCustomer.c_name}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  objectFit: "cover",
                  maxHeight: "300px",
                  marginTop: "16px",
                  marginBottom: "16px",
                }}
              />
            </Col>
            <Col span={16}>
              <div>
                <p><strong>Name:</strong> {selectedCustomer.c_name}</p>
                <p><strong>Address:</strong> {selectedCustomer.c_address}</p>
                <p><strong>City:</strong> {selectedCustomer.c_city}</p>
                <p><strong>Country:</strong> {selectedCustomer.c_country}</p>
                <p><strong>Zip Code:</strong> {selectedCustomer.c_zipcode}</p>
                <p><strong>Fax:</strong> {selectedCustomer.c_fax}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: "16px" }}>
            <Col span={24}>
              <h3>Sales History</h3>
              <Table
                columns={salesColumns}
                dataSource={salesHistory}
                rowKey="SL_ID"
                loading={loading}
                pagination={false}
              />
            </Col>
          </Row>
        </Modal>
      )}
    </>
  );
};

export default CustomerDetails;
