import { Table, Space, Button, Input } from "antd";
import {useState, useRef} from 'react';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import './Products.css';
import AddnewProduct from "./Productfeatures/addnewProduct";
import { Form, Popconfirm, Typography } from 'antd';
import EditableCell from './Productfeatures/EditableCell'; // Import your EditableCell component

const Products = () => {
    // for testing should be remove and using data from database
    const Data = [
        {
          key: '1',
          productname: 'John Brown',
          sellprice: 32,
          costprice: 'New York No. 1 Lake Park',
        },
        {
          key: '2',
          productname: 'John Brown',
          sellprice: 32,
          costprice: 'New York No. 1 Lake Park',
        },
        {
          key: '3',
          productname: 'John Brown',
          sellprice: 36,
          costprice: 'New York No. 1 Lake Park',
        },
        {
          key: '4',
          productname: 'John Brown',
          sellprice: 42,
          costprice: 'New York No. 1 Lake Park',
        },
      ];
      
    // product data to show in table
    // eslint-disable-next-line no-unused-vars
    const [productData, setproductData] = useState([]);

    //const [sortedInfo, setSortedInfo] = useState({});

// for editing rows
    const [form] = Form.useForm();
    const [data, setData] = useState(Data);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
    form.setFieldsValue({
      productphoto: '',
      productname: '',
      category: '',
      quantity: '',
      sellprice: '',
      costprice: '',
      expiredate: '',
      modelcode: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };


    // search for spacific element
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
    //   end search handle

    // when using clear sort button
    // const clearAll = () => {
    // setSortedInfo({});
    // };

    const handleDelete = (key) => {
        // should update the database after deleting
        // using table data instead of Data, setdata
        const newData = data.filter((item) => item.key !== key);
        setData(newData);
      };


    const columns = [
        {
          title: 'Product Photo',
          dataIndex: 'productphoto',
          key: 'productphoto',
          editable: true,
        },
        {
          title: 'Product Name',
          dataIndex: 'productname',
          key: 'productname',
          editable: true,
          ...getColumnSearchProps('productname'),
        },
        {
          title: 'Category',
          dataIndex: 'category',
          key: 'category',
          editable: true,
          ...getColumnSearchProps('category'),
        },
        {
            title: 'Cost Price',
            dataIndex: 'costprice',
            key: 'costprice',
            // sorter: (a, b) => a.costprice - b.costprice,
            // sortOrder: sortedInfo.columnKey === 'costprice' ? sortedInfo.order : null,
            // ellipsis: true,
            sorter: {
                compare: (a, b) => a.costprice - b.costprice,
                multiple: 3,
              },
            editable: true,
            ...getColumnSearchProps('costprice'),
        },
        {
            title: 'Sell Price',
            dataIndex: 'sellprice',
            key: 'sellprice',
            // sorter: (a, b) => a.sellprice - b.sellprice,
            // sortOrder: sortedInfo.columnKey === 'sellprice' ? sortedInfo.order : null,
            // ellipsis: true,
            ...getColumnSearchProps('sellprice'),
            sorter: {
                compare: (a, b) => a.sellprice - b.sellprice,
                multiple: 2,
              },
            editable: true,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            // sorter: (a, b) => a.quantity - b.quantity,
            // sortOrder: sortedInfo.columnKey === 'qunatity' ? sortedInfo.order : null,
            // ellipsis: true,
            ...getColumnSearchProps('quantity'),
            sorter: {
                compare: (a, b) => a.quantity - b.quantity,
                multiple: 1,
            },
            editable: true,
        },
        {
            title: 'Expire Date',
            dataIndex: 'expiredate',
            key: 'expiredate',
            editable: true,
            ...getColumnSearchProps('expiredata'),
        },
        {
            title: 'Model Code',
            dataIndex: 'modelcode',
            key: 'modelcode',
            editable: true,
            ...getColumnSearchProps('modelcode'),
        },
        {
        title: 'Delete Operation',
        dataIndex: '',
        key: 'x',
        render: (_, record) =>
            Data.length >= 1 ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                <a>Delete</a>
              </Popconfirm>
            ) : null,
        },
        {
        title: 'Edit Operation',
        dataIndex: 'operation',
        render: (_, record) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <Typography.Link
                onClick={() => save(record.key)}
                style={{
                  marginInlineEnd: 8,
                }}
              >
                Save
              </Typography.Link>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
          );
        },
          },
      ];
    


      const mergedColumns = columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record) => ({
            record,
            inputType: col.dataIndex === 'sellprice' | 'costprice' | 'qunatity' ? 'number' : 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        };
      });

        return (
    <>
        {/* section of table */}
        <h2 style = {{textAlign: "left", fontWeight: "500"}}>Products</h2>
            <AddnewProduct 
            // To get inserted data from user
            handleFinish={{}}
            handleUploadChange={{}}
            />
        <div className = "table-container">
            <Space
            style={{
               marginBottom: 16,
            }}
            >
            {/* <Button onClick={clearAll}>Clear sorters</Button> */}
            </Space>
            <Form form={form} component={false}>
            <Table
            components={{
                body: {
                cell: EditableCell,
            },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        showSorterTooltip={{
            target: 'sorter-icon',
        }}
        rowKey={(record) => record.id} // Ensure rows have unique keys
        pagination={{
          onChange: cancel,
        }}
      />
      </Form>
        </div>
        
        </>
    );
};
export default Products;

