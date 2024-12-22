
import { useEffect, useState } from 'react';
import { Modal, Select, InputNumber, Button, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AddSparepart = ({ visible, rep_id, onClose, fetchAllDUM , fetchSpareParts, tablespareParts, setUpdatedSpareParts}) => {
  const [spareParts, setSpareParts] = useState([]);       // spare parts showen when select
  const [selectedSparePart, setSelectedSparePart] = useState(null); 
  const [quantity, setQuantity] = useState(1); 
  const [loading, setLoading] = useState(false); 

  
  // Fetch available spare parts
  const fetchavailableSpareParts = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/availableSpareParts?rep_id=${rep_id}`);
      setSpareParts(response.data);
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      //message.error('Failed to load available spare parts.');
    }
  };
  
  useEffect(() => {
    if (visible) fetchavailableSpareParts();
  }, [visible]);


  const handleAdd = async () => {
    if (!selectedSparePart || quantity < 1) {
      message.error('Please select a spare part and enter a valid quantity.');
      return;
    }

    
    try {
      setLoading(true);
      

      const stockResponse = await axios.get(`http://localhost:4000/checkSparePartStock/${selectedSparePart}`);
      const availableStock = stockResponse.data.stock;

      if (availableStock < quantity) {
        message.error(`Not enough stock. Available: ${availableStock}`);
        setLoading(false);
        return;
      }


      await axios.post('http://localhost:4000/addSpare_RepairProcess', {
        rep_id,
        sp_id: selectedSparePart,
        sp_quantity: quantity,
      });


      await axios.post('http://localhost:4000/updateSpareinStock', {
        sp_id: selectedSparePart,
        quantity,
      });

      const newSparePart = spareParts.find(sp => sp.p_id === selectedSparePart);

      const updatedTableData = [
        ...tablespareParts,
        {
          sp_id: newSparePart.p_id,
          sp_name: newSparePart.p_name,
          sp_category: newSparePart.p_category,
          sp_quantity: quantity,
          sp_model_code: newSparePart.model_code,
        },
      ];

      setUpdatedSpareParts(updatedTableData);

      message.success('Spare part added successfully.');
      fetchAllDUM(); 
      fetchSpareParts();
      onClose(); 
    } catch (error) {
      console.error('Error adding spare part:', error);
      message.error('Failed to add spare part.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Spare Part"
      centered
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      {/* Spare Part Selector */}
      <Select
        placeholder="Select Spare Part"
        style={{ width: '100%', marginBottom: 20 }}
        onChange={(value) => setSelectedSparePart(value)}
      >
        {spareParts.map((spare) => (
          <Option key={spare.p_id} value={spare.p_id}>
            {spare.p_name} - (Available: {spare.p_quantity})
          </Option>
        ))}
      </Select>

      {/* Quantity Input */}
      <InputNumber
        placeholder="Enter quantity used"
        min={1}
        value={quantity}
        onChange={(value) => setQuantity(value)}
        style={{ width: '100%', marginBottom: 20 }}
      />

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} style={{ marginRight: 10 }}>
          Cancel
        </Button>
        <Button
          type="primary"
          loading={loading}
          onClick={handleAdd}
        >
          Add
        </Button>
      </div>
    </Modal>
  );
};

export default AddSparepart;
