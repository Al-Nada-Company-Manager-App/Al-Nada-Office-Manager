import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Table } from "antd";
import axios from "axios";
const CustomerDetails = ({
  selectedCustomer,
  isModalVisible,
  handleModalClose,
}) => {
  const [salesHistory, setSalesHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCustomer) {
      fetchSalesHistory(selectedCustomer.c_id);
    }
  }, [selectedCustomer]);

  const fetchSalesHistory = async (customerId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/getCustomerSales/${customerId}`
      );
      console.log(response);
      setSalesHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch sales history:", error);
    } finally {
      setLoading(false);
    }
  };

  const salesColumns = [
    {
        title: 'Sale ID',
        dataIndex: 'sl_id',
        sorter: (a, b) => a.sl_id - b.sl_id,
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
    },
    {
        title: 'Bill Number',
        dataIndex: 'sl_billnum',
    },
    {
        title: 'Sale Date',
        dataIndex: 'sl_date',
        sorter: (a, b) => new Date(a.sl_date) - new Date(b.sl_date),
        sortDirections: ['descend', 'ascend'],
        render: (date) => {
            const formattedDate = new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-');
            return <span>{formattedDate}</span>;
        },
    },
  {
    title: 'Discount',
    dataIndex: 'sl_discount',
  },
  {
    title: 'Tax',
    dataIndex: 'sl_tax',
  },
  {
    title: 'Total',
    dataIndex: 'sl_total',
    sorter: (a, b) => a.sl_total - b.sl_total,
  },
  {
    title: 'Currency',
    dataIndex: 'sl_currency',
    filters: [
        {
            text: 'USD',
            value: 'USD',
        },
        {
            text: 'EUR',
            value: 'EUR',
        },
        {
            text: 'EGP',
            value: 'EGP',
        },

    ],
    onFilter: (value, record) => record.sl_currency.indexOf(value) === 0,
  },
  {
    title: 'Status',
    dataIndex: 'sl_status',
    filters: [
        {
            text: 'Completed',
            value: 'Completed',
        },
        {
            text: 'Pending',
            value: 'Pending',
        },
        {
            text: 'Cancelled',
            value: 'Cancelled',
        },
    ],
    onFilter: (value, record) => record.sl_status.indexOf(value) === 0,
    render: (status) => {
        let statusColor = '';
        let statusText = status;

        // Check the status and apply appropriate color
        if (status === 'Completed') {
            statusColor = 'green';
        } else if (status === 'Pending') {
            statusColor = 'gray';
        } else if (status === 'Cancelled') {
            statusColor = 'red';
        }
        return <span style={{ color: statusColor }}>{statusText}</span>;
    },
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
