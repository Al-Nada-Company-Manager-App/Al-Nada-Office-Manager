import React, { useState } from 'react';
import { Modal, Table, Input, Button } from 'antd';
import { useSelector,useDispatch } from 'react-redux';
import { fetchSuppliers,setSelectedSupplier,setSelectSupplierModalVisible } from '../../Store/Supplier';


const SupplierModal = () => {
  const dispatch = useDispatch(); 
  const { suppliersData,selectSupplierModalVisible } = useSelector((state) => state.Suppliers);
  const [searchTerm, setSearchTerm] = useState('');

    React.useEffect(() => {
       dispatch(fetchSuppliers());
    }, [dispatch]);
    const onSelectSupplier = (supplier) => {
      dispatch(setSelectedSupplier(supplier));
      dispatch(setSelectSupplierModalVisible(false));
    }



  const columns = [
    {
      title: 'Supplier Name',
      dataIndex: 's_name',
      key: 'name',
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button onClick={() => onSelectSupplier(record)}>Select</Button>
      ),
    },
  ];
  const onClose = () => {
    dispatch(setSelectSupplierModalVisible(false));
  }

  return (
    <Modal
      title="Select Supplier"
      open={selectSupplierModalVisible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Input
        placeholder="Search Supplier"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Table
        dataSource={suppliersData}
        columns={columns}
        rowKey="S_ID"
        pagination={false}
      />
    </Modal>
  );
};

export default SupplierModal;
