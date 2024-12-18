
import { Modal, Row, Col, Button, Space, InputNumber } from 'antd';
import { useState, useEffect } from 'react';
import {Form} from 'antd';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import axios from 'axios';
import { message } from 'antd';

// eslint-disable-next-line react/prop-types, no-unused-vars
const SparepartDetails = ({repId, selectedSparePart, handleisSpareDetailsClose, isSpareDetails, fetchAllDUM, setSpareParts,fetchSpareParts,tablespareParts,setUpdatedSpareParts }) => {

    const [showEditQuantity, setshowEditQuantity] = useState(false);
    const [quantity, setQuantity] = useState(selectedSparePart?.sp_quantity || "");

    const handleEditSparePart = (sp_id, newQuantity) => {
      setSpareParts((prevSpareParts) =>
        prevSpareParts.map((part) =>
          part.sp_id === sp_id ? { ...part, sp_quantity: newQuantity } : part
        )
      );
    };


  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:4000/api/repair-process/${repId}/spare-part/${selectedSparePart.sp_id}`, {
        sp_quantity: quantity,
      });
      message.success("Spare part quantity updated successfully!");
      fetchAllDUM();
      handleEditSparePart(selectedSparePart.sp_id, quantity);
      onCancel();
    } catch (error) {
      message.error("Failed to update spare part.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/repair-process/${repId}/spare-part/${selectedSparePart.sp_id}`);
      message.success("Spare part deleted successfully!");
      const updatedSpareParts = tablespareParts.filter(
        (spare) => spare.sp_id !== selectedSparePart.sp_id
      );
      setUpdatedSpareParts(updatedSpareParts); 
  
      fetchAllDUM(); 
      fetchSpareParts();
      handleisSpareDetailsClose();
    } catch (error) {
      message.error("Failed to delete spare part.");
    }
  };

  const onCancel = () => {
    setshowEditQuantity(false);
    handleisSpareDetailsClose();
  };

  useEffect(() => {
    fetchAllDUM();
  }, []);

    return (
        <> {selectedSparePart && (
            <Modal
            title="Spare Part Operations"
            centered
            open={isSpareDetails}
            onCancel={onCancel}
            footer={[
              <Button key="close" onClick={onCancel}>
                  Close
              </Button>,
            ]}
            width={800} 
            >
            {selectedSparePart && (
            <Space direction="vertical" style={{ width: "100%" }}>
                
                <Button style={{ width: "100%"
                    }}
                      key="editsparepart"  type="primary"
                      onClick={() => {setshowEditQuantity(true)}}
                      icon={<EditOutlined />} iconPosition='start' >
                          Edit Spare Part
            </Button>
            {showEditQuantity && ( <div style={{display:"flex", justifyContent:"center" , gap: "10px", alignItems:"center",flexDirection:"column"}}>
                <InputNumber
                  min={1}
                  placeholder="Quantity"
                  style={{ flex: 1, width: "25%" }}
                  defaultValue={selectedSparePart.sp_quantity}
                  onChange={(value) => setQuantity(value)}
                />
                <Button style={{ width: "25%"
                }}
                  key="editquantity"  type="primary"
                  onClick={handleSave} >
                      Save
            </Button>
            </div>
                )}
                <Button style={{ width: "100%"
                    }}
                      key="deleteSparepart"  type="primary"
                      onClick={handleDelete}
                      icon={<DeleteOutlined />} iconPosition='start' danger >
                          Delete Spare Part
            </Button>
            </Space>
              
            )}
          </Modal>
          
      )}
      </>
    );
};
export default SparepartDetails;