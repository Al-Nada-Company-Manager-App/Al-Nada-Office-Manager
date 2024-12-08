import React, { useState, useEffect } from "react";
import { Modal, Table, Input, Button, InputNumber } from "antd";
import { useDispatch,useSelector } from "react-redux";
import { fetchProducts,setSelectedProduct,setfilteredProducts,setSelectedProductModalVisible } from "../../Store/Product";

const ProductModal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { productsData,selectedProductModalVisible,selectedProducts, filteredProducts,productLoading} = useSelector((state) => state.Products);
  const {saleType} = useSelector((state) => state.Sales);
  useEffect(() => {
      dispatch(fetchProducts());
      dispatch(setfilteredProducts(productsData));
  }, []);

  const handleSelect = (product) => {
    console.log(product);
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
        { ...product, quantity: 1, totalCost: product.p_sellprice },
      ];
  
      dispatch(setSelectedProduct(updatedSelectedProducts));  // Dispatch the updated selected products
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
                totalCost: item.p_sellprice * (value || 1),
              }
            : item
        )
      )
    );
  };

  const closeProductModal = () => dispatch(setSelectedProductModalVisible(false));


  const mainColumns = [
    {
      title: "Product Name",
      dataIndex: "p_name",
      key: "name",
    },
    ...(saleType === "SELLITEMS"
      ? [
          {
            title: "Price",
            dataIndex: "p_sellprice",
            key: "price",
            render: (price) => `$${price}`,
          },
        ]
      : []),
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
    ...(saleType === "SELLITEMS"
      ? [
          {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            render: (_, record) => (
              <InputNumber
                min={1}
                max={record.p_quantity}
                value={record.quantity}
                onChange={(value) =>
                  updateProductDetails(record.p_id, "quantity", value)
                }
              />
            ),
          },
          {
            title: "Total Cost",
            dataIndex: "totalCost",
            key: "totalCost",
            render: (_, record) => `$${record.totalCost.toFixed(2)}`,
          },
        ]
      : []),
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
    const filtered = products.filter((product) =>
      product.p_name.toLowerCase().includes(searchValue)
    );
  
    dispatch(setFilteredProducts(filtered)); // Dispatch filtered products
  };

  const handleSubmit = () => {
  closeProductModal();
  };

  return (
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
      <h3>Available Products</h3>
      <Table
        dataSource={filteredProducts}
        columns={mainColumns}
        rowKey="p_id"
        loading={productLoading}
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
