import React, { useState } from 'react';
import { Modal, Table, Input, Button } from 'antd';
import axios from 'axios';


const getSuppliers = async () => {
    try {
        const response = await axios.get('http://localhost:4000/allSupplierPch');
        return response.data;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
    }
};


const SupplierModal = ({ visible, onClose, onSelectSupplier }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState([]);

    React.useEffect(() => {
        const fetchSuppliers = async () => {
            const suppliers = await getSuppliers();
            setSuppliers(suppliers);
        };
        fetchSuppliers();
    }, []);


  const columns = [
    {
      title: 'Supplier Name',
      dataIndex: 's_name',
      key: 'name',
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button onClick={() => onSelectSupplier(record)}>Select</Button>
      ),
    },
  ];

  return (
    <Modal
      title="Select Supplier"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Input
        placeholder="Search Supplier"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Table
        dataSource={suppliers}
        columns={columns}
        rowKey="S_ID"
        pagination={false}
      />
    </Modal>
  );
};

export default SupplierModal;
