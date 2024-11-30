import React, { useState } from 'react';
import { Modal, Table, Input, Button } from 'antd';

const CustomerModal = ({ visible, onClose, onSelectCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dummy customers data
  const customers = [
    { C_ID: 1, name: "Customer 1" },
    { C_ID: 2, name: "Customer 2" },
    { C_ID: 3, name: "Customer 3" },
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'name',
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
      visible={visible}
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
        dataSource={filteredCustomers}
        columns={columns}
        rowKey="C_ID"
        pagination={false}
      />
    </Modal>
  );
};

export default CustomerModal;
