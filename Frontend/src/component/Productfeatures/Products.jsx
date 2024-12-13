import { Table, Space, Button, Input } from "antd";
import {useState, useRef, useEffect} from 'react';
import axios from "axios";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import '../../Styles/Products.css';
import AddnewProduct from "./addnewProduct";
import ProductDetails from './ProductDetails';
import { useSelector,useDispatch } from "react-redux";
import { setEditedSelectedProduct,setSelecteditem,fetchProducts,setdetailProductModalVisible } from "../../Store/Product";


const Products = () => {
    
    const [Data,setproductData] = useState([]);
    const dispatch = useDispatch();

    const { productsData,productLoading,deleteProductModalVisible } = useSelector((state) => state.Products);



    const [file, setFile] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [editedData, seteditedData] = useState({
      p_photo: "",
      p_name: "",
      p_category: "",
      p_costprice: "",
      p_sellprice: "",
      p_quantity: "",
      expire_date: "",
      model_code: "",
    });




    const saveEditedProductData = () => {
      // setproductData((prevData) => {
      //   return prevData.map((row) => {
      //     if (row.id === editedData.id) {
      //       return { ...row, ...editedData };
      //     }
      //     return row;
      //   });
      // });
      // setSelectedProduct(editedData);
    };


    const handleRowClick = (record) => {
      dispatch(setSelecteditem(record));
      dispatch(setEditedSelectedProduct(record));
      dispatch(setdetailProductModalVisible(true));
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





    const columns = [
        {
          title: 'Product Name',
          dataIndex: 'p_name',
          key:'p_name',
          ...getColumnSearchProps('p_name'),
        },
        {
          title: 'Category',
          dataIndex: 'p_category',
          key: 'p_category',
          ...getColumnSearchProps('p_category'),
        },
        {
            title: 'Cost Price',
            dataIndex: 'p_costprice',
            key: 'p_costprice',
            sorter: {
                compare: (a, b) => a.p_costprice - b.p_costprice,
                multiple: 3,
              },
        },
        {
            title: 'Sell Price',
            dataIndex: 'p_sellprice',
            key: 'p_sellprice',
            sorter: {
                compare: (a, b) => a.p_sellprice - b.p_sellprice,
                multiple: 2,
              },
        },
        {
            title: 'Quantity',
            dataIndex: 'p_quantity',
            key: 'p_quantity',
            ...getColumnSearchProps('p_quantity'),
            sorter: {
                compare: (a, b) => a.p_quantity - b.p_quantity,
                multiple: 1,
            },
        },
        {
            title: 'Expire Date',
            dataIndex: 'expire_date',
            key: 'expire_date',
            sorter: (a, b) => new Date(a.sl_date) - new Date(b.sl_date),
        sortDirections: ['descend', 'ascend'],
        render: (date) => {
            const formattedDate = new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-');
            return <span>{formattedDate}</span>;
        },
        },
        {
            title: 'Model Code',
            dataIndex: 'model_code',
            key: 'model_code',
            ...getColumnSearchProps('model_code'),
        },
      ];
    


      const handleUploadChange = (info) => {
        console.log(info.fileList);
        if (info.fileList.length > 0) {
            const filee = info.fileList[0].originFileObj;
            setFile(filee);
        } else {
            setFile(null);
        }
    };
    
    const handleFinish = async (values) => {
        const formData = new FormData(); 
        values.expiredate = values.expiredate ? values.expiredate.format('YYYY-MM-DD') : null;
    
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
        });
    
        if (file) {
            formData.append('photo', file); 
        }
    
        try {
            await axios.post('http://localhost:4000/AddProduct', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/formdata',
                },
            });
    
            const updatedData = await fetchProducts();
            setproductData(updatedData); 
            return true;
        } catch (error) {
            console.error('Error adding Product:', error);
            return false;
        }
    };
    

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);



    return (
    <>
        {/* section of table */}
        <h2 style = {{textAlign: "left", fontWeight: "500"}}>Products</h2>
        
            <AddnewProduct 
            handleFinish={handleFinish}
            handleUploadChange={handleUploadChange}
            />
        <div className = "table-container">
            <Table
              dataSource={productsData}
              showSorterTooltip={{
                target: 'sorter-icon',
              }}
              rowKey="p_id" // Ensure rows have unique keys
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
              })}
              columns={columns}
              loading={productLoading}
            />

            <ProductDetails/>
        </div>
        
        </>
    );
};
export default Products;

