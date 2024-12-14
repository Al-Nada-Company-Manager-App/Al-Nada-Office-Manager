import React, {useState,useRef} from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import '../../Styles/Debts.css';
import AddnewDebt from './addnewDebt';
import DebtDetails from './DebtsDetails';
import { useSelector, useDispatch } from 'react-redux';
import  {fetchDebts,setselectedDebt,setDebtModalVisible} from "../../Store/Debts";
import {convertTimestampToDate} from '../../utils/ConvertDate';


const Debts = () => {
  const dispatch = useDispatch();
  const { debtData,debtsLoading } = useSelector((state) => state.Debts);
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
    dispatch(fetchDebts());
  }, []);

  const handleRowClick = (record) => {
    dispatch(setselectedDebt(record));
    dispatch(setDebtModalVisible(true));
  };


const columns = [
    {
        title: 'Debt ID',
        dataIndex: 'd_id',
        sorter: (a, b) => a.d_id - b.d_id,
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
    },
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
        title: 'Debt Date',
        dataIndex: 'd_date',
        sorter: (a, b) => new Date(a.d_date) - new Date(b.d_date),
        sortDirections: ['descend', 'ascend'],
        render: (date) => {
            const formattedDate = convertTimestampToDate(date);
            return <span>{formattedDate}</span>;
        },
    },
    {
        title: 'Debt Type',
        dataIndex: 'd_type',
        ...getColumnSearchProps('d_type'),
    },
  {
    title: 'Debt Amount',
    dataIndex: 'd_amount',
    render: (value) => value.toFixed(2),
  },
  {
    title: 'Currency',
    dataIndex: 'd_currency',
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
      <AddnewDebt/>
      <div 
       style={{
        margin: '24px 16px',
       }
        }
      >
        <h1>Debts</h1>
      </div>
      <Table
        columns={columns}
        dataSource={debtData}
        loading={debtsLoading}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowKey={(record) => record.d_id} 
      />
      <DebtDetails/>
    </>
  );
};

export default Debts;
