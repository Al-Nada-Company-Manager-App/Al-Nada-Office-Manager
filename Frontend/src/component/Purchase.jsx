// eslint-disable-next-line no-unused-vars

import React, {useState,useRef} from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import './Purchase.css';
import PurchaseDetails from './Purchasefeachers/PurchaseDetails';
import AddNewPurchase from './Purchasefeachers/AddNewPurchase';


const fetchPurchase = async () => {
  try {
      const response = await axios.get('http://localhost:4000/allPurchase');
      return response.data;
  } catch (error) {
      console.error('Error fetching purchase:', error);
  }
};


const purchase = () => {
  const [selectedpurchase, setselectedpurchase] = React.useState(null);
  const [isModalVisible, setIsModalVisible] =React.useState(false);
  const [purchaseData, setPurchaseData] = React.useState([]);
    const [searchText, setSearchText] = React.useState('');
  const [searchedColumn, setSearchedColumn] = React.useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

 React.useEffect(() => {
    fetchPurchase().then((data) => setPurchaseData(data));////////
  }, []);

  const handleRowClick = (record) => {
    setselectedpurchase(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setselectedpurchase(null);
  };

  const handleDeletePurchase = (id) => async () => {
    try {
      const response = await axios.post('http://localhost:4000/deletePurchase', { id }, { withCredentials: true });/////
      fetchPurchase().then((data) =>{ setPurchaseData(data)});

      handleModalClose();
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  const handleFinish = async (values) => {
    try {
      await axios.post('http://localhost:4000/addPch', values, { withCredentials: true });
    fetchPurchase().then((data) => setPurchaseData(data));
        return true;
    } catch (error) {
      console.error('Error adding purchase:', error);
      return false;
    }
  };


const columns = [
    {
        title: 'Purchase ID',
        dataIndex: 'pch_id',
        sorter: (a, b) => a.pch_id - b.pch_id,
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
    },
    {
        title: 'Supplier Name',
        dataIndex: 's_name',
        ...getColumnSearchProps('s_name'),
    },
    {
        title: 'Bill Number',
        dataIndex: 'pch_billnum',
        ...getColumnSearchProps('pch_billnum'),
    },
    {
        title: 'Purchase Date',
        dataIndex: 'pch_date',
        sorter: (a, b) => new Date(a.pch_date) - new Date(b.pch_date),
        sortDirections: ['descend', 'ascend'],
        render: (date) => {
            const formattedDate = new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-');
            return <span>{formattedDate}</span>;
        },
    },
    {
      title: 'Cost',
      dataIndex: 'pch_cost',
      sorter: (a, b) => new Date(a.pch_cost) - new Date(b.pch_cost),
      sortDirections: ['descend', 'ascend'],
    },
   
  {
    title: 'Tax',
    dataIndex: 'pch_tax',

  },
  {
    title: 'Total',
    dataIndex: 'pch_total',
    sorter: (a, b) => a.pch_total - b.pch_total,
  },
  {
    title: 'Expense',
    dataIndex: 'pch_expense',
    sorter: (a, b) => a.pch_expense- b.pch_expense,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Customs Cost',
    dataIndex: 'pch_customscost',
    sorter: (a, b) => a.pch_customscost- b.pch_customscost,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Customs Num',
    dataIndex: 'pch_customsnum',
    sorter: (a, b) => a.pch_customsnum- b.pch_customsnum,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Currency',
    dataIndex: 'pch_currency',
    filters: [
        {
            text: 'USD',
            value: 'USD',
        },
        {
            text: 'EUR',
            value: 'EUR',
        },
        {
            text: 'EGP',
            value: 'EGP',
        },

    ],
    onFilter: (value, record) => record.sl_currency.indexOf(value) === 0,
  },
];

  return (
    <>
      <AddNewPurchase handleFinish={handleFinish} />
      <div 
       style={{
        margin: '24px 16px',
       }
        }
      >
        <h1>Sales</h1>
      </div>
      <Table
        columns={columns}
        dataSource={purchaseData}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowKey={(record) => record.sl_id} // Ensure rows have unique keys
      />
      <PurchaseDetails
        selectedPurchase={selectedpurchase}
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
        handleDeletePurchase={handleDeletePurchase}
      /> 
    </>
  );
};

export default purchase;
