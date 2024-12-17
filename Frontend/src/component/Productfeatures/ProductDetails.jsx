
import { Modal, Row, Col, Button } from 'antd';
import { useState, useEffect } from 'react';
import EditexitProduct from './editexitProduct';
import {Form} from 'antd';
import { useSelector,useDispatch } from 'react-redux';
import { setdetailProductModalVisible,setSelecteditem,handleDeleteProduct,fetchProducts, setEditedSelectedProduct } from '../../Store/Product';
import { use } from 'react';
// eslint-disable-next-line react/prop-types, no-unused-vars
const ProductDetails = ({ handleSaveData, editedData, seteditedData}) => {
  const dispatch = useDispatch();
  const { selectedProduct,detailProductModalVisible,editedSelectedProduct} = useSelector((state) => state.Products);
  const [isEditProductOpen, setisEditProductOpen] = useState(false);
  const closeEditProduct = () => setisEditProductOpen(false);
  const [editingform] = Form.useForm();


  const openEditProduct = () => {
    setisEditProductOpen(true);
    dispatch(setEditedSelectedProduct(selectedProduct));
  };

  useEffect(() => {
    if (editedSelectedProduct) {
      editingform.setFieldsValue(editedSelectedProduct);  // Update form fields with editedData
    }
  }, [editedSelectedProduct, editingform]);
 const handleModalClose = () => {
    dispatch(setdetailProductModalVisible(false));
    dispatch(setSelecteditem(null));
  }
  const handleDelete = async (id) => {
    await dispatch(handleDeleteProduct(id));
    dispatch(fetchProducts());
    dispatch(setdetailProductModalVisible(false));
    
    };

    return (
        <> {selectedProduct && (
            <Modal
            title="Product Details"
            centered
            open={detailProductModalVisible}
            onCancel={handleModalClose}
            footer={[
              <Button key="close" onClick={handleModalClose}>
                  Close
              </Button>,
            ]}
            width={800} 
            >
            {selectedProduct && (
              <div>
                <Row gutter={16}>
                  {/* Product Image on the left */}
                  <Col span={8}>
                    <img
                      // eslint-disable-next-line react/prop-types
                      src={selectedProduct.p_photo || 'https://via.placeholder.com/150'}
                      // eslint-disable-next-line react/prop-types
                      alt={`${selectedProduct.p_name}`}
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        maxHeight: '300px', 
                        marginTop: '16px',
                        marginBottom: '16px',
                      }}
                    />
                    <div className="product-actions">
                    <Button style={{width: '100%'}}
                      key="deleteProduct" onClick={() => handleDelete(selectedProduct.p_id)} type="primary" danger>
                          Delete Product
                      </Button>
                      <Button
                      style={{marginTop: '10px' , width: '100%'}}
                      key="editProduct" onClick={openEditProduct} danger>
                          Edit Product
                      </Button>
                    </div>
                  </Col>
      
                  {/* Product Details on the right */}
                  <Col span={16}>
                  <div className="product-details">
                    <p><strong>Product Name:</strong> {selectedProduct.p_name}</p>
                    <p><strong>Product Cost Price:</strong> {selectedProduct.p_costprice}</p>
                    <p><strong>Product Sell Price:</strong> {selectedProduct.p_sellprice}</p>
                    <p><strong>Product Quantity:</strong> {selectedProduct.p_quantity}</p>
                    <p><strong>Product Category:</strong> {selectedProduct.p_category}</p>
                    <p><strong>Model Code:</strong> {selectedProduct.model_code}</p>
                    <p><strong>Expire Date:</strong> {selectedProduct.expire_date}</p>
                    <p><strong>Product Description:</strong> {selectedProduct.p_description}</p>
                  </div>
                 </Col>
                </Row>
              </div>
            )}
            <EditexitProduct
            editedData= {editedData}
            seteditedData= {seteditedData}
            isEditProductOpen= {isEditProductOpen}
            closeEditProduct= {closeEditProduct}
            handleSaveData = {handleSaveData}
            editingform={editingform}
            />
          </Modal>
          
      )}
      </>
    );
};
export default ProductDetails;