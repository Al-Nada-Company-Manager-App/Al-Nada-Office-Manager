import React, { useState } from "react";
import { Modal, Table, Input, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";

import {fetchSales,setaddSaleModalVisible,setSelectedSale,setselectedSalesModalVisible} from "../../Store/Sales";
import { PlusOutlined } from "@ant-design/icons";
import AddNewwSale from "../Salesfeatures/AddNewSale";

const SaleModal = () => {

  const { selectedSalesModalVisible,salesLoading } = useSelector((state) => state.Sales);
  const [searchTerm, setSearchTerm] = useState("");
  const { salesData } = useSelector((state) => state.Sales);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchSales());
  }, []);
  const closeSalesModal = () =>
    dispatch(setselectedSalesModalVisible(false));
  const handleSelectSales = (sale) => {
    dispatch(setSelectedSale(sale));
    closeSalesModal();
  };
  const columns = [
    {
      title: "Sales_ID",
      dataIndex: "sl_id",
      key: "name",
    },
    {
      title: "Customer Name",
      dataIndex: "c_name",
      key: "name",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button onClick={() => handleSelectSales(record)}>Select</Button>
      ),
    },
  ];
  const handleaddClick = () => {
    dispatch(setaddSaleModalVisible(true));
  }

  return (
    <>
    <Modal
      title="Select Sales"
      open={selectedSalesModalVisible}
      onCancel={closeSalesModal}
      footer={null}
      width={600}
    >
      <Input
        placeholder="Search By Customer"
        onChange={(e) => setSearchTerm(e.target.value)}
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
        Add New Sale
      </Button>
      <Table
        dataSource={salesData}
        columns={columns}
        rowKey="C_ID"
        loading={salesLoading}
        pagination={false}
      />
    </Modal>
    <AddNewwSale/>
    </>

  );
};

export default SaleModal;
