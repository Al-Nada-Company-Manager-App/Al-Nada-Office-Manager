import React, { useState, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import axios from "axios";
import "../../Styles/PQ.css"; 
import PQDetails from "./PQDetails"; 
import AddNewPriceQuotation from "./AddNewPQ"; 
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPriceQuotations,
  setpqDetailVisible,
  setSelectedPQ,
  setAddPQModalVisible,
} from "../../Store/PriceQuotation"; // Update actions for PQ

const PriceQuotations = () => {
  const dispatch = useDispatch();
  const { pqData, pqLoading } = useSelector((state) => state.PriceQuotations); // Updated state for PQ
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
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
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
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
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
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
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  React.useEffect(() => {
    dispatch(fetchPriceQuotations()); // Fetch Price Quotations on load
  }, []);

  const handleRowClick = (record) => {
    dispatch(setSelectedPQ(record));
    dispatch(setpqDetailVisible(true));
  };

  const columns = [
    {
      title: "PQ ID",
      dataIndex: "pq_id",
      sorter: (a, b) => a.pq_id - b.pq_id,
      sortDirections: ["descend", "ascend"],
      defaultSortOrder: "descend",
    },
    {
      title: "Customer Name",
      dataIndex: "c_name",
      ...getColumnSearchProps("c_name"),
    },
    {
      title: "Discount",
      dataIndex: "pq_discount",
      sorter: (a, b) => a.pq_discount - b.pq_discount,
    },
    {
      title: "Currency",
      dataIndex: "pq_currency",
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
      onFilter: (value, record) => record.pq_currency.indexOf(value) === 0,
    },
    {
      title: "Duration",
      dataIndex: "pq_duration",
      ...getColumnSearchProps("pq_duration"),
    },
    {
      title: "total",
      dataIndex: "pq_total",
      sorter: (a, b) => a.pq_total - b.pq_total,
    },
  ];

  return (
    <>
      <AddNewPriceQuotation />
      <div
        style={{
          margin: "24px 16px",
        }}
      >
        <h1>Price Quotations</h1>
      </div>
      <Table
        columns={columns}
        dataSource={pqData}
        loading={pqLoading}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowKey={(record) => record.pq_id}
      />
      <PQDetails /> {/* Component to display Price Quotation details */}
    </>
  );
};

export default PriceQuotations;
