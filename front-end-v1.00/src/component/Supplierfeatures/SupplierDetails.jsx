import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Table } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPurchaseHistory,
  handleDeleteSupplier,
  fetchSuppliers,
  setSupplierModalVisible,
  setSelectedSupplier,
  setupdateSupplierModalVisible,
} from "../../Store/Supplier";
import UpdateSupplierModal from "./UpdateSupplier";
const purchaseColumns = [
  {
    title: "Purchase ID",
    dataIndex: "pch_id",
    sorter: (a, b) => a.pch_id - b.pch_id,
    sortDirections: ["descend", "ascend"],
    defaultSortOrder: "descend",
  },
  {
    title: "Bill Number",
    dataIndex: "pch_billnum",
  },
  {
    title: "Purchase Date",
    dataIndex: "pch_date",
    sorter: (a, b) => new Date(a.pch_date) - new Date(b.pch_date),
    sortDirections: ["descend", "ascend"],
    render: (date) => {
      const formattedDate = new Date(date)
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");
      return <span>{formattedDate}</span>;
    },
  },
  {
    title: "Cost",
    dataIndex: "pch_cost",
    sorter: (a, b) => new Date(a.pch_cost) - new Date(b.pch_cost),
    sortDirections: ["descend", "ascend"],
  },

  {
    title: "Tax",
    dataIndex: "pch_tax",
  },
  {
    title: "Total",
    dataIndex: "pch_total",
    sorter: (a, b) => a.pch_total - b.pch_total,
  },
  {
    title: "Expense",
    dataIndex: "pch_expense",
    sorter: (a, b) => a.pch_expense - b.pch_expense,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Customs Cost",
    dataIndex: "pch_customscost",
    sorter: (a, b) => a.pch_customscost - b.pch_customscost,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Customs Num",
    dataIndex: "pch_customsnum",
    sorter: (a, b) => a.pch_customsnum - b.pch_customsnum,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Currency",
    dataIndex: "pch_currency",
    filters: [
      {
        text: "USD",
        value: "USD",
      },
      {
        text: "EUR",
        value: "EUR",
      },
      {
        text: "EGP",
        value: "EGP",
      },
    ],
    onFilter: (value, record) => record.sl_currency.indexOf(value) === 0,
  },
];

const SupplierDetails = () => {
  const dispatch = useDispatch();
  const {
    selectedSupplier,
    supplierModalVisible,
    supplierPurchasesData,
    PurchaseLoading,
  } = useSelector((state) => state.Suppliers);
  const { userAccess } = useSelector((state) => state.auth);

  useEffect(() => {
    if (selectedSupplier) dispatch(fetchPurchaseHistory(selectedSupplier.s_id));
  }, [selectedSupplier]);

  const handleModalClose = () => {
    dispatch(setSupplierModalVisible(false));
    dispatch(setSelectedSupplier(null));
  };
  const handleDelete = async (id) => {
    await dispatch(handleDeleteSupplier(id));
    dispatch(fetchSuppliers());
    handleModalClose();
  };
  const handleUpdate = () => {
    dispatch(setSupplierModalVisible(false));
    dispatch(setupdateSupplierModalVisible(true));
  };

  return (
    <>
      {selectedSupplier && (
        <Modal
          title="Supplier Details"
          centered
          open={supplierModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Close
            </Button>,
            userAccess.supplier_delete && (
              <Button
                key="Delete Supplier"
                onClick={() => handleDelete(selectedSupplier.s_id)}
                type="primary"
                danger
              >
                Delete Supplier
              </Button>
            ),
            userAccess.supplier_edit && (
              <Button
                key="Update Supplier"
                onClick={handleUpdate}
                type="primary"
              >
                Update Supplier
              </Button>
            ),
          ]}
          width={1000}
        >
          <Row gutter={16}>
            <Col span={8}>
              <img
                src={
                  selectedSupplier.s_photo
                    ? "./Suppliers/" + selectedSupplier.s_photo
                    : "https://via.placeholder.com/150"
                }
                alt={selectedSupplier.s_name}
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              />
            </Col>
            <Col span={16}>
              <div>
                <p>
                  <strong>Supplier Name:</strong> {selectedSupplier.s_name}
                </p>
                <p>
                  <strong>Supplier Address:</strong>{" "}
                  {selectedSupplier.s_address}
                </p>
                <p>
                  <strong>Supplier City:</strong> {selectedSupplier.s_city}
                </p>
                <p>
                  <strong>Supplier Country:</strong>{" "}
                  {selectedSupplier.s_country}
                </p>
                <p>
                  <strong>ZipCode:</strong> {selectedSupplier.s_zipcode}
                </p>
                <p>
                  <strong>Fax: </strong>
                  {selectedSupplier.s_fax}
                </p>
              </div>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: "16px" }}>
            <Col span={24}>
              <h3>Purchase History</h3>
              <Table
                columns={purchaseColumns}
                dataSource={supplierPurchasesData}
                rowKey="PCH_ID"
                loading={PurchaseLoading}
              />
            </Col>
          </Row>
        </Modal>
      )}
      <UpdateSupplierModal />
    </>
  );
};
export default SupplierDetails;
