// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import "../../Styles/Supplier.css";
import AddNewSupplier from "./AddNewSupplier"
import SupplierDetails from"./SupplierDetails"
import { useSelector,useDispatch } from "react-redux";
import { fetchSuppliers,setSupplierModalVisible,setSelectedSupplier } from "../../Store/Supplier";
const Supplier = () => {
  const dispatch = useDispatch();
  const {suppliersData} = useSelector((state) => state.Suppliers);
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
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
    dispatch(fetchSuppliers());

  }, [dispatch]);
  const handleRowClick = (record) => {
    dispatch(setSelectedSupplier(record));
    dispatch(setSupplierModalVisible(true));
  };
  

  const columns = [
   
    {
      title: "Supplier Name",
      dataIndex: "s_name",
      ...getColumnSearchProps("s_name"),
    },
    {
      title: "Supplier Address",
      dataIndex: "s_address",
      ...getColumnSearchProps("s_address"),
    },
    {
      title: "Supplier City",
      dataIndex: "s_city",
      ...getColumnSearchProps("s_city"),
    },
    {
      title: "Supplier Country",
      dataIndex: "s_country",
      ...getColumnSearchProps("s_country"),
    },
    {
      title: "Supplier ZIP_Code",
      dataIndex: "s_zipcode",
      ...getColumnSearchProps("s_zipcode"),
    },
    {
      title: "Supplier Fax",
      dataIndex: "s_fax",
      ...getColumnSearchProps("s_fax"),
    },
  ];
  return (
    <>
      < AddNewSupplier />
      <div
        style={{
          margin: "24px 16px",
        }}
      >
        <h1>Suppliers</h1>
      </div>
      <Table
        columns={columns}
        dataSource={suppliersData}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowKey={(record) => record.sl_id} 
      />
      <SupplierDetails/> 
    </>
  );
};
export default Supplier;
