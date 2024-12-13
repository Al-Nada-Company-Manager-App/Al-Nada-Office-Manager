import React, { useState } from "react";
import { Modal, Table, Input, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCustomers,
  setSelectedCustomerModalVisible,
  setSelectedCustomer,
} from "../../Store/Customer";

const CustomerModal = () => {
  const { selectCustomerModalVisible,CustomersLoading } = useSelector(
    (state) => state.Customers
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { customersData } = useSelector((state) => state.Customers);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchCustomers());
  }, []);
  const closeCustomerModal = () =>
    dispatch(setSelectedCustomerModalVisible(false));
  const handleSelectCustomer = (customer) => {
    dispatch(setSelectedCustomer(customer));
    closeCustomerModal();
  };
  const columns = [
    {
      title: "Customer Name",
      dataIndex: "c_name",
      key: "name",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button onClick={() => handleSelectCustomer(record)}>Select</Button>
      ),
    },
  ];

  return (
    <Modal
      title="Select Customer"
      open={selectCustomerModalVisible}
      onCancel={closeCustomerModal}
      footer={null}
      width={600}
    >
      <Input
        placeholder="Search Customer"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <Table
        dataSource={customersData}
        columns={columns}
        rowKey="C_ID"
        loading={CustomersLoading}
        pagination={false}
      />
    </Modal>
  );
};

export default CustomerModal;
