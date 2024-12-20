import { Table, Space, Button, Input } from "antd";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import "../../Styles/Products.css";
import AddnewProduct from "./addnewProduct";
import ProductDetails from "./ProductDetails";
import { useSelector, useDispatch } from "react-redux";
import {
  setEditedSelectedProduct,
  setSelecteditem,
  fetchProducts,
  setdetailProductModalVisible,
} from "../../Store/Product";

const Products = () => {
  const dispatch = useDispatch();
  const { productsData, productLoading, deleteProductModalVisible } =
    useSelector((state) => state.Products);

    const { userAccess } = useSelector((state) => state.auth);
  const spareParts = productsData.filter(
    (product) => product.p_category === "Spare Part"
  );
  const labEquipments = productsData.filter(
    (product) => product.p_category === "Laboratory Equipment"
  );
  const chemicals = productsData.filter(
    (product) => product.p_category === "Chemical"
  );
  const measuringControllers = productsData.filter(
    (product) => product.p_category === "Measuring & Controllers"
  );
  const otherProducts = productsData.filter(
    (product) =>
      ![
        "Spare Part",
        "Laboratory Equipment",
        "Chemical",
        "Measuring & Controllers",
      ].includes(product.p_category)
  );

  const handleRowClick = (record) => {
    dispatch(setSelecteditem(record));
    dispatch(setdetailProductModalVisible(true));
  };
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

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const columns = [
    {
      title: "P_ID",
      dataIndex: "p_id",
      width: 20,
    },
    {
      title: "Product Photo",
      dataIndex: "p_photo",
      render: (text, record) => (
        <img
          src={
            record.p_photo
              ? "./Products/" + record.p_photo
              : "https://via.placeholder.com/150"
          }
          alt="Product"
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "5px",
          }}
        />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "p_name",
      key: "p_name",
      // Assuming getColumnSearchProps is a custom function for search
      ...getColumnSearchProps("p_name"),
    },
    {
      title: "Category",
      dataIndex: "p_category",
      key: "p_category",
      ...getColumnSearchProps("p_category"),
    },
    {
      title: "Cost Price",
      dataIndex: "p_costprice",
      key: "p_costprice",
      sorter: (a, b) => a.p_costprice - b.p_costprice,
      multiple: 3,
    },
    {
      title: "Sell Price",
      dataIndex: "p_sellprice",
      key: "p_sellprice",
      sorter: (a, b) => a.p_sellprice - b.p_sellprice,
      multiple: 2,
    },
    {
      title: "Quantity",
      dataIndex: "p_quantity",
      key: "p_quantity",
      ...getColumnSearchProps("p_quantity"),
      sorter: (a, b) => a.p_quantity - b.p_quantity,
      multiple: 1,
    },
    // Conditionally add the Expire Date column only for Chemical category
    {
      title: "Expire Date",
      dataIndex: "expire_date",
      key: "expire_date",
      render: (date) => {
        const formattedDate = new Date(date)
          .toLocaleDateString("en-GB")
          .replace(/\//g, "-");
        return <span>{formattedDate}</span>;
      },
      sorter: (a, b) => new Date(a.expire_date) - new Date(b.expire_date),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Model Code",
      dataIndex: "model_code",
      key: "model_code",
      ...getColumnSearchProps("model_code"),
    },
  ];

  return (
    <>
      {/* section of table */}
      <h2 style={{ textAlign: "left", fontWeight: "500" }}>Products</h2>

      {userAccess.products_add && <AddnewProduct />}
      <div>
        {/* Measuring & Controllers Table */}
        <div className="table-heading">
          <h3>Measuring & Controllers</h3>
          <div className="heading-line"></div>
        </div>
        <Table
          dataSource={measuringControllers}
          rowKey="p_id"
          columns={columns.filter((col) => col.title !== "Expire Date")}
          loading={productLoading}
          pagination={{ pageSize: 10 }}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => handleRowClick(record),
            };
          }
          }
        />
        {/* Laboratory Equipment Table */}
        <div className="table-heading">
          <h3>Laboratory Equipment</h3>
          <div className="heading-line"></div>
        </div>
        <Table
          dataSource={labEquipments}
          rowKey="p_id"
          columns={columns.filter((col) => col.title !== "Expire Date")}
          loading={productLoading}
          pagination={{ pageSize: 10 }}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => handleRowClick(record),
            };
          }
          }
        />
        {/* Chemical Table with Expire Date */}
        <div className="table-heading">
          <h3>Chemical Products</h3>
          <div className="heading-line"></div>
        </div>
        <Table
          dataSource={chemicals}
          rowKey="p_id"
          columns={columns}
          loading={productLoading}
          pagination={{ pageSize: 10 }}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => handleRowClick(record),
            };
          }
          }
        />
        {/* Spare Parts Table */}
        <div className="table-heading">
          <h3>Spare Parts</h3>
          <div className="heading-line"></div>
        </div>
        <Table
          dataSource={spareParts}
          rowKey="p_id"
          columns={columns.filter((col) => col.title !== "Expire Date")}
          loading={productLoading}
          pagination={{ pageSize: 10 }}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => handleRowClick(record),
            };
          }
          }
        />

        {/* Other Products Table */}
        <div className="table-heading">
          <h3>Other Products</h3>
          <div className="heading-line"></div>
        </div>
        <Table
          dataSource={otherProducts}
          rowKey="p_id"
          columns={columns.filter((col) => col.title !== "Expire Date")}
          loading={productLoading}
          pagination={{ pageSize: 10 }}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => handleRowClick(record),
            };
          }
          }
        />
      </div>
      <ProductDetails />
    </>
  );
};
export default Products;
