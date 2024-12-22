import React, { useState, useEffect } from "react";
import { Modal, Table, Input, Button, InputNumber } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  setSelectedProduct,
  setfilteredProducts,
  setSelectedProductModalVisible,
} from "../../Store/Product";
import { setaddProductModalVisible } from "../../Store/Product";
import AddnewProduct from "../Productfeatures/addnewProduct";
import { PlusOutlined } from "@ant-design/icons";

const ProductModal = () => {
  const dispatch = useDispatch();
  const {
    productsData,
    selectedProductModalVisible,
    selectedProducts,
    filteredProducts,
    productLoading,
  } = useSelector((state) => state.Products);

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(setfilteredProducts(productsData));
  }, [dispatch]);

  const handleSelect = (product) => {
    if (selectedProducts.some((item) => item.p_id === product.p_id)) {
      // Deselect the product
      const updatedSelectedProducts = selectedProducts.filter(
        (item) => item.p_id !== product.p_id
      );
      const updatedFilteredProducts = [...filteredProducts, product];

      dispatch(setSelectedProduct(updatedSelectedProducts));
      dispatch(setfilteredProducts(updatedFilteredProducts));
    } else {
      // Select the product
      const updatedFilteredProducts = filteredProducts.filter(
        (item) => item.p_id !== product.p_id
      );
      const updatedSelectedProducts = [
        ...selectedProducts,
        { ...product, quantity: 1, totalCost: product.p_costprice },
      ];

      dispatch(setSelectedProduct(updatedSelectedProducts)); // Dispatch the updated selected products
      dispatch(setfilteredProducts(updatedFilteredProducts)); // Dispatch the updated filtered products
    }
  };

  const updateProductDetails = (p_id, key, value) => {
    dispatch(
      setSelectedProduct(
        selectedProducts.map((item) =>
          item.p_id === p_id
            ? {
                ...item,
                [key]: value,
                totalCost: item.p_costprice * (value || 1),
              }
            : item
        )
      )
    );
  };
  const closeProductModal = () =>
    dispatch(setSelectedProductModalVisible(false));

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
    closeProductModal();
  };
  const handleaddClick = () => {
    dispatch(setaddProductModalVisible(true));
  };

  return (
    <>
      <Modal
        title="Select Products"
        open={selectedProductModalVisible}
        onCancel={closeProductModal}
        footer={[
          <Button key="cancel" onClick={closeProductModal}>
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
        <Button
          type="primary"
          onClick={() => handleaddClick()}
          style={{
            marginBottom: "16px",
            backgroundColor: "#389e0d",
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
          }}
          icon={<PlusOutlined />}
        >
          Add New Product
        </Button>
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
      {selectedProductModalVisible && <AddnewProduct />}
    </>
  );
};

export default ProductModal;
