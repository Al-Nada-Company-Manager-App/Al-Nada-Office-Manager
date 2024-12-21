import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Modal,
  Upload,
  message,
  Space,
} from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import Highlighter from "react-highlight-words";
import "../../Styles/Customer.css";
import CustomerDetails from "./CustomerDetails";
import AddnewCustomer from "./addnewCustomer";  
import UpdateCustomerModal from "./updateCustomer";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector,useDispatch } from "react-redux";
import { handleDeleteCustomer,addMarkiting,deleteAllMarkitings,fetchCustomers,setCustomerModalVisible,setSelectedCustomer,setaddCustomerModalVisible,setupdateCustomerModalVisible } from "../../Store/Customer";



const Customer = () => {
  const { customersData, CustomersLoading} = useSelector((state) => state.Customers);
  const dispatch = useDispatch();
  const { SignedUser } = useSelector((state) => state.auth);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const { userAccess } = useSelector((state) => state.auth);
  const handleRowClick = (record) => {
    dispatch(setCustomerModalVisible(true)); 
    dispatch(setSelectedCustomer(record));
  };
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Customer List", 14, 20);
    const tableColumn = [
      "Name",
      "Address",
      "City",
      "Country",
      "Zip Code",
      "Fax",
    ];
    const tableRows = customersData.map((customer) => [
      customer.c_name,
      customer.c_address,
      customer.c_city,
      customer.c_country,
      customer.c_zipcode,
      customer.c_fax,
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save("Customer_List.pdf");
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const handleAddMarketing = (customerId) => {
    const e_id = SignedUser.id;
    const data={e_id:e_id,c_id:customerId} 
    dispatch(addMarkiting(data));
    
  };
  const handDeleteMarkitings = () => {
    dispatch(deleteAllMarkitings());
    
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

  const columns = [
    {
      title: "C_ID",
      dataIndex: "c_id",
      width: 20,
    },
    {
      title: "Customer Photo",
      dataIndex: "c_photo",
      render: (text, record) => (
        <img
          src={
            record.c_photo
              ? "./Customers/" + record.c_photo
              : "https://via.placeholder.com/150"
          }
          alt="Supplier"
          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
        />
      ),
    },
    {
      title: "Customer Name",
      dataIndex: "c_name",
      ...getColumnSearchProps("c_name"),
    },
    { title: "Address", dataIndex: "c_address" },
    { title: "City", dataIndex: "c_city" },
    { title: "Country", dataIndex: "c_country" },
    { title: "Zip Code", dataIndex: "c_zipcode" },
    { title: "Fax", dataIndex: "c_fax" },
    {
      title: "Action",
      render: (_, record) => (
        <>
          {userAccess.customer_edit && (<Button
            type="link"
            className="update-btn"
            onClick={(e) => {
              e.stopPropagation(); 
              handleEdit(record);
            }}
          >
            Update
          </Button>
        )}
          {userAccess.customer_delete && (<Button
            type="link"
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation(); 
              handleDelete(record.c_id);
            }}
            
          >
            Delete
          </Button>
        )}
        {userAccess.customer_delete && (<Button
            type="link"
            className="add-marketing-btn"
            onClick={(e) => {
              e.stopPropagation(); 
              handleAddMarketing(record.c_id); // You can define this function
              
            }}
            
          >
            Add Marketing
          </Button>
        )}
        
        </>
      ),
    },
  ];


  const handleDelete = async (id) => {
     await dispatch(handleDeleteCustomer(id));
     dispatch(fetchCustomers());
  };

  const handleEdit = (customer) => {
    dispatch(setSelectedCustomer(customer));
    dispatch(setupdateCustomerModalVisible(true));
   };
  
  const handleaddClick = () => {
    dispatch(setaddCustomerModalVisible(true));
  }



  return (
    <div>
      {userAccess.customer_add && (<Button
        type="primary"
        onClick={() => handleaddClick()}
        style={{ marginRight: 16 }}
      >
        Add Customer
      </Button>
    )}
      <Button type="primary" onClick={exportToPDF} style={{ marginBottom: 16,
        marginRight: 16
       }}>
        Export to PDF
      </Button>
      <Button
        type="primary"
        onClick={() => handDeleteMarkitings()}
      >
        Delete All Markitings
      </Button>
      <Table
        columns={columns}
        dataSource={customersData}
        loading={CustomersLoading}
        rowKey="c_id"
        onRow={(record) => ({
          onClick: () => handleRowClick(record), 
        })}
      />
      <CustomerDetails/>
      <AddnewCustomer/>
      <UpdateCustomerModal/>
    </div>
  );
};

export default Customer;
