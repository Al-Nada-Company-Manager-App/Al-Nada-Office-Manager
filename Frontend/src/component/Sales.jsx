import React, {useState,useRef} from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
//import './Sales.css';
import SaleDetails from './Salesfeatures/SalesDetails';
import AddNewSale from './Salesfeatures/AddNewSale';



const fetchSales = async () => {
  try {
    const response = await axios.get('http://localhost:4000/allSales');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
  }
};

const Sales = () => {
  const [selectedSale, setSelectedSale] = React.useState(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [salesData, setSalesData] = React.useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
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
    fetchSales().then((data) => setSalesData(data));
  }, []);

  const handleRowClick = (record) => {
    setSelectedSale(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedSale(null);
  };

  const handleDeleteSale = (id) => async () => {
    try {
      await axios.post('http://localhost:4000/deleteSale', { id }, { withCredentials: true });
      fetchSales().then((data) => setSalesData(data));
      handleModalClose();
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };

  const handleFinish = async (values) => {
    try {
      await axios.post('http://localhost:4000/addSale', values, { withCredentials: true });
      fetchSales().then((data) => setSalesData(data));
      return true;
    } catch (error) {
      console.error('Error adding sale:', error);
      return false;
    }
  };


const columns = [
    {
        title: 'Sale ID',
        dataIndex: 'sl_id',
        sorter: (a, b) => a.sl_id - b.sl_id,
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
    },
    {
        title: 'Customer Name',
        dataIndex: 'c_name',
        ...getColumnSearchProps('c_name'),
    },
    {
        title: 'Bill Number',
        dataIndex: 'sl_billnum',
        ...getColumnSearchProps('sl_billnum'),
    },
    {
        title: 'Sale Date',
        dataIndex: 'sl_date',
        sorter: (a, b) => new Date(a.sl_date) - new Date(b.sl_date),
        sortDirections: ['descend', 'ascend'],
        render: (date) => {
            const formattedDate = new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-');
            return <span>{formattedDate}</span>;
        },
    },
  {
    title: 'Discount',
    dataIndex: 'sl_discount',
  },
  {
    title: 'Tax',
    dataIndex: 'sl_tax',
  },
  {
    title: 'Total',
    dataIndex: 'sl_total',
    sorter: (a, b) => a.sl_total - b.sl_total,
  },
  {
    title: 'Currency',
    dataIndex: 'sl_currency',
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
  {
    title: 'Status',
    dataIndex: 'sl_status',
    filters: [
        {
            text: 'Completed',
            value: 'Completed',
        },
        {
            text: 'Pending',
            value: 'Pending',
        },
        {
            text: 'Cancelled',
            value: 'Cancelled',
        },
    ],
    onFilter: (value, record) => record.sl_status.indexOf(value) === 0,
    render: (status) => {
        let statusColor = '';
        let statusText = status;

        // Check the status and apply appropriate color
        if (status === 'Completed') {
            statusColor = 'green';
        } else if (status === 'Pending') {
            statusColor = 'gray';
        } else if (status === 'Cancelled') {
            statusColor = 'red';
        }
        return <span style={{ color: statusColor }}>{statusText}</span>;
    },
    },
];


  return (
    <>
      <AddNewSale handleFinish={handleFinish} />
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
        dataSource={salesData}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowKey={(record) => record.sl_id} // Ensure rows have unique keys
      />
      <SaleDetails
        selectedSale={selectedSale}
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
        handleDeleteSale={handleDeleteSale}
      /> 
    </>
  );
};

export default Sales;
