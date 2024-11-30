import React, { useState } from 'react';
import { Modal, Table, Input, Button } from 'antd';

const ProductModal = ({ visible, onClose, onSelectProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dummy products data
  const products = [
    { P_ID: 1, name: "Product 1" },
    { P_ID: 2, name: "Product 2" },
    { P_ID: 3, name: "Product 3" },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleSelect = (product) => {
    setSelectedProducts(prev => {
      if (prev.includes(product)) {
        return prev.filter(item => item !== product);
      } else {
        return [...prev, product];
      }
    });
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button onClick={() => handleSelect(record)}>
          {selectedProducts.includes(record) ? 'Deselect' : 'Select'}
        </Button>
      ),
    },
  ];

  const handleSubmit = () => {
    onSelectProducts(selectedProducts);
    onClose();
  };

  return (
    <Modal
      title="Select Products"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Select Products
        </Button>
      ]}
      width={600}
    >
      <Input
        placeholder="Search Product"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Table
        dataSource={filteredProducts}
        columns={columns}
        rowKey="P_ID"
        pagination={false}
      />
    </Modal>
  );
};

export default ProductModal;
