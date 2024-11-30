import React, { useState } from 'react';
import { Modal, Table, Input, Button } from 'antd';
import axios from 'axios';


const getCustomers = async () => {
    try {
        const response = await axios.get('http://localhost:4000/allCustomerSales');
        return response.data;
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
};


const CustomerModal = ({ visible, onClose, onSelectCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);

    React.useEffect(() => {
        const fetchCustomers = async () => {
            const customers = await getCustomers();
            setCustomers(customers);
        };
        fetchCustomers();
    }, []);


  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'c_name',
      key: 'name',
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button onClick={() => onSelectCustomer(record)}>Select</Button>
      ),
    },
  ];

  return (
    <Modal
      title="Select Customer"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Input
        placeholder="Search Customer"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Table
        dataSource={customers}
        columns={columns}
        rowKey="C_ID"
        pagination={false}
      />
    </Modal>
  );
};

export default CustomerModal;
