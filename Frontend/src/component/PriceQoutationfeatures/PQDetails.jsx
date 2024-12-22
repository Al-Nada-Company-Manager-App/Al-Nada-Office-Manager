import React, { useEffect } from "react";
import { Modal, Button, Row, Col, Table } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPriceQuotations,
  deletePriceQuotation,
  setpqDetailVisible,
  setSelectedPQ,
  getproductspq,
} from "../../Store/PriceQuotation";

const PriceQuotationDetails = () => {
  const dispatch = useDispatch();
  const { selectedPQ, pqDetailVisible, products } = useSelector(
    (state) => state.PriceQuotations
  );
  const { userAccess } = useSelector((state) => state.auth);

  // Fetch products for the selected price quotation
  useEffect(() => {
    if (selectedPQ) {
      dispatch(getproductspq(selectedPQ.pq_id));
    }
  }, [selectedPQ, dispatch]);

  const handleModalClose = () => {
    dispatch(setpqDetailVisible(false));
    dispatch(setSelectedPQ(null));
  };

  const handleDeletePQ = (id) => async () => {
    await dispatch(deletePriceQuotation(id));
    dispatch(setpqDetailVisible(false));
    dispatch(setSelectedPQ(null));
    dispatch(fetchPriceQuotations());
  };

  const ProductsColumns = [
    {
      title: "Product ID",
      dataIndex: "p_id",
    },
    {
      title: "Product Name",
      dataIndex: "p_name",
    },
    {
      title: "Cost Price",
      dataIndex: "p_costprice",
      render: (costPrice) => `$${costPrice.toFixed(2)}`,
    },
    {
      title: "Sell Price",
      dataIndex: "p_sellprice",
      render: (sellPrice) => `$${sellPrice.toFixed(2)}`,
    },
    {
      title: "Quantity",
      dataIndex: "p_quantity",
    },
    {
      title: "Category",
      dataIndex: "p_category",
    },
    {
      title: "Expire Date",
      dataIndex: "expire_date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <Modal
      title="Price Quotation Details"
      centered
      open={pqDetailVisible}
      onCancel={handleModalClose}
      footer={[
        <Button key="close" onClick={handleModalClose}>
          Close
        </Button>,
        selectedPQ && userAccess.price_delete && (
          <Button
            key="delete"
            onClick={handleDeletePQ(selectedPQ.pq_id)}
            type="primary"
            danger
          >
            Delete Price Quotation
          </Button>
        ),
      ]}
      width={800}
    >
      {selectedPQ && (
        <div>
          <Row gutter={16}>
            <Col span={8}>
              {/* Placeholder for PQ Image */}
              <img
                src={
                  selectedPQ.c_photo
                    ? "./Customers/" + selectedPQ.c_photo
                    : "https://via.placeholder.com/150"
                }
                alt="Price Quotation"
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              />
            </Col>
            <Col span={16}>
              <p>
                <strong>Price Quotation ID:</strong> {selectedPQ.pq_id}
              </p>
              <p>
                <strong>Discount:</strong> {selectedPQ.pq_discount}
              </p>
              <p>
                <strong>Currency:</strong> {selectedPQ.pq_currency}
              </p>
              <p>
                <strong>Duration:</strong> {selectedPQ.pq_duration}
              </p>
              <p>
                <strong>Total:</strong> {selectedPQ.pq_total}
              </p>
            </Col>
          </Row>
          <Table
            columns={ProductsColumns}
            dataSource={products} // The products associated with the price quotation
            rowKey="p_id"
            pagination={false}
          />
        </div>
      )}
    </Modal>
  );
};

export default PriceQuotationDetails;
