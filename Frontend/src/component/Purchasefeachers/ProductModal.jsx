import React, { useState, useEffect } from "react";
import { Modal, Table, Input, Button, InputNumber } from "antd";
import axios from "axios";

const getProducts = async () => {
  try {
    const response = await axios.get("http://localhost:4000/allProductsPch");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const ProductModal = ({ visible, onClose, onSelectProducts, type }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productss = await getProducts();
      console.log(productss);
      setProducts(productss);
      setFilteredProducts(productss); 
    };
    fetchProducts();
  }, []);

  const handleSelect = (product) => {
    if (selectedProducts.some((item) => item.p_id === product.p_id)) {
      // Deselect the product
      setSelectedProducts((prev) =>
        prev.filter((item) => item.p_id !== product.p_id)
      );
      setFilteredProducts((prev) => [...prev, product]);
    } else {
      // Select the product
      setFilteredProducts((prev) =>
        prev.filter((item) => item.p_id !== product.p_id)
      );
      setSelectedProducts((prev) => [
        ...prev,
        { ...product, quantity: product.p_quantity, costprice: product.p_costprice },
        ]);
    }
  };

  const updateProductDetails = (p_id, key, value) => {
    setSelectedProducts((prev) =>
      prev.map((item) =>
        item.p_id === p_id
          ? { ...item, [key]: value }
          : item
      )

    );

  };

  const mainColumns = [
    {
      title: "Product Name",
      dataIndex: "p_name",
      key: "name",
    },

    {
      title: "Action",
      render: (_, record) => (
        <Button onClick={() => handleSelect(record)}>
          {selectedProducts.some((item) => item.p_id === record.p_id)
            ? "Deselect"
            : "Select"}
        </Button>
      ),
    },
  ];

  const selectedColumns = [
    {
      title: "Product Name",
      dataIndex: "p_name",
      key: "name",
    },

          {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            render: (_, record) => (
              <InputNumber
                min={1}
                defaultValue={1}
                onChange={(value) =>
                  updateProductDetails(record.p_id, "quantity", value)
                }
                
              />
            ),
          },
          {
            title: "Purchase Price",
            dataIndex: "p_costprice",
            key: "p_costprice",
            render: (_, record) => (
              <InputNumber
                min={1}
                defaultValue={record.p_costprice}
                onChange={(value) =>
                  updateProductDetails(record.p_id, "costprice", value)
                }
                
              />
            ),
          },
    {
      title: "Action",
      render: (_, record) => (
        <Button onClick={() => handleSelect(record)}>Remove</Button>
      ),
    },
  ];

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    setFilteredProducts(
      products.filter((product) =>
        product.p_name.toLowerCase().includes(searchValue)
      )
    );
  };

  const handleSubmit = () => {
    {
      onSelectProducts(
        selectedProducts.map((product) => ({
          p_id: product.p_id,
          quantity: product.quantity,
          costprice: product.costprice,
        }))
      );
    } 
    
    onClose();
  };

  return (
    <Modal
      title="Select Products"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Select Products
        </Button>,
      ]}
      width={800}
    >
      <Input
        placeholder="Search Product"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "10px" }}
      />
      <h3>Available Products</h3>
      <Table
        dataSource={filteredProducts}
        columns={mainColumns}
        rowKey="p_id"
        pagination={false}
      />
      {selectedProducts.length > 0 && (
        <>
          <h3>Selected Products</h3>
          <Table
            dataSource={selectedProducts}
            columns={selectedColumns}
            rowKey="p_id"
            pagination={false}
          />
        </>
      )}
    </Modal>
  );
};

export default ProductModal;
