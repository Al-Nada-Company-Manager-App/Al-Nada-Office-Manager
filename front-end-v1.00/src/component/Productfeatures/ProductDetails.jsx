import { Modal, Row, Col, Button,message } from "antd";
import { useState, useEffect } from "react";
import UpdateProduct from "./updateProduct";
import { Form } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  setdetailProductModalVisible,
  setSelecteditem,
  handleDeleteProduct,
  fetchProducts,
  setupdateProductModalVisible,
} from "../../Store/Product";

const ProductDetails = ({ handleSaveData, editedData, seteditedData }) => {
  const dispatch = useDispatch();
  const { selectedProduct, detailProductModalVisible, editedSelectedProduct } =
    useSelector((state) => state.Products);
  const { userAccess } = useSelector((state) => state.auth);
  const handleModalClose = () => {
    dispatch(setdetailProductModalVisible(false));
    dispatch(setSelecteditem(null));
  };
  const handleDelete = async (id) => {
    const res =await dispatch(handleDeleteProduct(id));
    if(res.payload.success)
      message.success(res.payload.message);
    else
      message.error("Failed to Delete Product");
    dispatch(fetchProducts());
    dispatch(setdetailProductModalVisible(false));
  };
  const handleUpdate = () => {
    dispatch(setdetailProductModalVisible(false));
    dispatch(setupdateProductModalVisible(true));
  };

  return (
    <>
      {selectedProduct && (
        <Modal
          title="Product Details"
          centered
          open={detailProductModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Close
            </Button>,
            userAccess.products_delete && (
              <Button
                key="Delete Product"
                onClick={() => handleDelete(selectedProduct.p_id)}
                type="primary"
                danger
              >
                Delete Product
              </Button>
            ),
            userAccess.products_edit && (
              <Button
                key="Update Product"
                onClick={handleUpdate}
                type="primary"
              >
                Update Product
              </Button>
            ),
          ]}
          width={800}
        >
          {selectedProduct && (
            <div>
              <Row gutter={16}>
                {/* Product Image on the left */}
                <Col span={8}>
                  <img
                    src={
                      selectedProduct.p_photo
                        ? "./Products/" + selectedProduct.p_photo
                        : "https://via.placeholder.com/150"
                    }
                    alt={`${selectedProduct.p_name}`}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      objectFit: "cover",
                      maxHeight: "300px",
                      marginTop: "16px",
                      marginBottom: "16px",
                    }}
                  />
                </Col>

                <Col span={16}>
                  <div className="product-details">
                    <p>
                      <strong>Product Name:</strong> {selectedProduct.p_name}
                    </p>
                    <p>
                      <strong>Product Cost Price:</strong>{" "}
                      {selectedProduct.p_costprice}
                    </p>
                    <p>
                      <strong>Product Sell Price:</strong>{" "}
                      {selectedProduct.p_sellprice}
                    </p>
                    <p>
                      <strong>Product Quantity:</strong>{" "}
                      {selectedProduct.p_quantity}
                    </p>
                    <p>
                      <strong>Product Category:</strong>{" "}
                      {selectedProduct.p_category}
                    </p>
                    <p>
                      <strong>Model Code:</strong> {selectedProduct.model_code}
                    </p>
                    <p>
                      <strong>Expire Date:</strong>{" "}
                      {selectedProduct.expire_date}
                    </p>
                    <p>
                      <strong>Product Description:</strong>{" "}
                      {selectedProduct.p_description}
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          )}
          <UpdateProduct />
        </Modal>
      )}
    </>
  );
};
export default ProductDetails;
