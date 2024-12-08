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
import userPhoto from "../../assets/UserPhoto.jpg";
import CustomerDetails from "./CustomerDetails";
import jsPDF from "jspdf";
import "jspdf-autotable";
const Customer = () => {
  const [customersData, setCustomersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const searchInput = useRef(null);
  const handleRowClick = (record) => {
    setSelectedCustomer(record); // Set the clicked customer as selected
    setIsDetailsModalVisible(true); // Open the modal
  };
  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/allcustomers");
      setCustomersData(response.data);
      setFilteredData(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Customer List", 14, 20);

    // Format data for autoTable
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

    // Add table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    // Save the PDF
    doc.save("Customer_List.pdf");
  };
  // Search functionality
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

  const columns = [
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
      title: "Photo",
      dataIndex: "c_name",
      render: (text) =>
        text ? (
          <img
            src={`http://localhost:4000/uploads/${text}.jpg`}
            alt="Customer"
            style={{ width: "50px", borderRadius: "4px" }}
          />
        ) : (
          <img
            src={userPhoto}
            alt="Default Customer"
            style={{ width: "50px", borderRadius: "4px" }}
          />
        ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button
            type="link"
            className="update-btn"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering row click
              handleEdit(record);
            }}
          >
            Update
          </Button>
          <Button
            type="link"
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering row click
              handleDelete(record.c_id);
            }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  // Handle adding a customer
  const handleAddCustomer = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (file) formData.append("photo", file);

    try {
      await axios.post("http://localhost:4000/addcustomer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Customer added successfully");
      fetchCustomers();
      setIsModalVisible(false);
    } catch (err) {
      console.error(err);
      message.error("Failed to add customer");
    }
  };

  // Handle deleting a customer
  const handleDelete = async (id) => {
    try {
      await axios.post("http://localhost:4000/deletecustomer", { id });
      message.success("Customer deleted successfully");
      fetchCustomers();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete customer");
    }
  };

  // Handle editing a customer
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsUpdateModalVisible(true);
  };

  // Handle updating a customer
  const handleUpdateCustomer = async (values) => {
    const formData = new FormData();

    // Correct way to append C_ID to formData
    formData.append("C_ID", selectedCustomer.c_id); // Use .append with key as string

    // Append the other values from the form
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );

    // If a new photo is selected, append it as well
    if (file) formData.append("photo", file);

    try {
      // Send the request with multipart/form-data
      await axios.post("http://localhost:4000/updatecustomer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Success message and refresh the data
      message.success("Customer updated successfully");
      fetchCustomers();
      setIsUpdateModalVisible(false);
    } catch (err) {
      console.error(err);
      message.error("Failed to update customer");
    }
  };

  // Modal for adding a customer
  const addCustomerModal = (
    <Modal
      title="Add Customer"
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleAddCustomer}>
        <Form.Item
          name="C_NAME"
          label="Customer Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="C_ADDRESS"
          label="Address"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="C_CITY" label="City" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="C_COUNTRY"
          label="Country"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="C_ZIPCODE"
          label="Zip Code"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="C_FAX" label="Fax">
          <Input />
        </Form.Item>
        <Form.Item label="Photo">
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Photo</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  // Modal for updating a customer
  const updateCustomerModal = (
    <Modal
      title="Update Customer"
      visible={isUpdateModalVisible}
      onCancel={() => setIsUpdateModalVisible(false)}
      footer={null}
    >
      <Form
        layout="vertical"
        onFinish={handleUpdateCustomer}
        initialValues={selectedCustomer}
      >
        <Form.Item
          name="C_NAME"
          label="Customer Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="C_ADDRESS"
          label="Address"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="C_CITY" label="City" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="C_COUNTRY"
          label="Country"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="C_ZIPCODE"
          label="Zip Code"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="C_FAX" label="Fax">
          <Input />
        </Form.Item>
        <Form.Item label="Photo">
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Photo</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginRight: 16 }} // Add space to the right
      >
        Add Customer
      </Button>
      <Button type="primary" onClick={exportToPDF} style={{ marginBottom: 16 }}>
        Export to PDF
      </Button>
      {addCustomerModal}
      {updateCustomerModal}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="c_id"
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // Handle row click
        })}
      />
      <CustomerDetails
        selectedCustomer={selectedCustomer} // The selected customer object
        isModalVisible={isDetailsModalVisible} // Modal visibility state
        handleModalClose={() => setIsDetailsModalVisible(false)} // Close modal
      />
    </div>
  );
};

export default Customer;
