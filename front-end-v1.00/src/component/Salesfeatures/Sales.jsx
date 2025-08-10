import React, { useState, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import axios from "axios";
import "../../Styles/Sales.css";
import SaleDetails from "./SalesDetails";
import AddNewSale from "./AddNewSale";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSales,
  deleteSale,
  addSale,
  setSelectedSale,
  setSaleModalVisible,
  setaddSaleModalVisible,
  fetchProductsinSale,
} from "../../Store/Sales";
import { PlusOutlined } from "@ant-design/icons";
import {convertTimestampToDate} from '../../Utils/ConvertDate';
import {addtodum,clearaddedDum} from "../../Store/Sales";


const Sales = () => {
  const dispatch = useDispatch();
  const { salesData, salesLoading } = useSelector((state) => state.Sales);
  const { userAccess } = useSelector((state) => state.auth);
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
            close
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
    dispatch(fetchSales());
  }, []);

  const handleRowClick = async(record) => {
    await dispatch(fetchProductsinSale({ saleId: record.sl_id , saleType: record.sl_type }));
    dispatch(setSelectedSale(record));
    dispatch(setSaleModalVisible(true));
  };

  const columns = [
    {
      title: "Sale ID",
      dataIndex: "sl_id",
      sorter: (a, b) => a.sl_id - b.sl_id,
      sortDirections: ["descend", "ascend"],
      defaultSortOrder: "descend",
    },
    {
      title: "Customer Name",
      dataIndex: "c_name",
      ...getColumnSearchProps("c_name"),
    },
    {
      title: "Bill Number",
      dataIndex: "sl_billnum",
      ...getColumnSearchProps("sl_billnum"),
    },
    {
      title: "Sale Date",
      dataIndex: "sl_date",
      sorter: (a, b) => new Date(a.sl_date) - new Date(b.sl_date),
      sortDirections: ["descend", "ascend"],
      render: (date) => {
        const formattedDate = convertTimestampToDate(date);
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Discount",
      dataIndex: "sl_discount",
    },
    {
      title: "Tax",
      dataIndex: "sl_tax",
    },
    {
      title: "Total",
      dataIndex: "sl_total",
      render: (total) => total.toFixed(2),
      sorter: (a, b) => a.sl_total - b.sl_total,
    },
    {
      title: "Currency",
      dataIndex: "sl_currency",
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
      onFilter: (value, record) => record.sl_currency.indexOf(value) === 0,
    },
    {
        title: "Type",
        dataIndex: "sl_type",
    },
    {
      title: "Status",
      dataIndex: "sl_status",
      filters: [
        {
          text: "Completed",
          value: "Completed",
        },
        {
          text: "Pending",
          value: "Pending",
        },
        {
          text: "Cancelled",
          value: "Cancelled",
        },
      ],
      onFilter: (value, record) => record.sl_status.indexOf(value) === 0,
      render: (status) => {
        let statusColor = "";
        let statusText = status;
        if (status === "Completed") {
          statusColor = "green";
        } else if (status === "Pending") {
          statusColor = "gray";
        } else if (status === "Cancelled") {
          statusColor = "red";
        }
        return <span style={{ color: statusColor }}>{statusText}</span>;
      },
    },
  ];
  const openSaleModal = () => {
    dispatch(setaddSaleModalVisible(true));
    dispatch(clearaddedDum());
  }

  return (
    <>
     {userAccess.sales_add && (
      <Button
        type="primary"
        onClick={openSaleModal}
        style={{
          marginBottom: "16px",
          backgroundColor: "#389e0d",
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
        }}
        icon={<PlusOutlined />}
      >
        Add Sale
      </Button>
      )}
      <AddNewSale />
      <div
        style={{
          margin: "24px 16px",
        }}
      >
        <h1>Sales</h1>
      </div>
      <Table
        columns={columns}
        dataSource={salesData}
        loading={salesLoading}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowKey={(record) => record.sl_id}
      />
      <SaleDetails />
    </>
  );
};

export default Sales;
