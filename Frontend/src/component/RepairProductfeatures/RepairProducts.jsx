
import { useEffect, useState, useRef } from "react";
import {Table, Space, Button, Input, message} from "antd";
import AddRepairProcess from "./AddRepairProcess";
import axios from "axios";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import RepairDetails from './RepairDetails';
import AddnewUnderMaintenance from './AddnewUnderMaintenance';

const RepairProducts = () => {
  
  const [repairProcesses, setRepairProcesses] = useState([]);
  const [devices, setDevices] = useState([]); // Devices under maintenance
  const [spareParts, setSpareParts] = useState([]); // Available spare parts
  const [loading, setLoading] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [detailRepairModalVisible, setdetailRepairModalVisible] = useState(false);

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
  
  // Fetch data for repair processes table
  const fetchAllDUM = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/AllRepairProcess");
      console.log("fetch all data");
      setRepairProcesses(response.data);
      console.log(response.data);
      return (response.data);
    } catch (error) {
      console.error("Error fetching repair processes:", error.message);
      console.log("error fetch data");
    } finally {
              setLoading(false);
          }
  };


  // const fetchDeviceData = async () => {
  //   try {
  //     setLoadingDUMData(true);
  //     const response = await axios.get("http://localhost:4000/AllDUM");
  //     console.log("fetch all data");
  //     setRepairProcesses(response.data);
  //     console.log(response.data);
  //     return (response.data);
  //   } catch (error) {
  //     console.error("Error fetching repair processes:", error.message);
  //     console.log("error fetch data");
  //   } finally {
  //     setLoadingDUMData(false);
  //         }
  // };

  // const handleDeleteSparePart = async (rep_id, sp_id) => {
  //   try {
  //     await axios.delete(`http://localhost:4000/api/repair-process/${rep_id}/spare-part/${sp_id}`);
  //     console.log("Spare part deleted successfully!");
  //     fetchAllDUM(); // Refresh table after deletion
  //   } catch (error) {
  //     console.error("Error deleting spare part:", error);
  //     console.log("Failed to delete spare part.");
  //   }
  // };

  // Fetch devices
  const fetchDevices = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/AllDUM");
      setDevices(response.data);
    } catch (error) {
      console.error("Failed to fetch devices:", error.message);
    }
  };

  // Fetch spare parts
  const fetchSpareParts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/AllSpareParts");
      setSpareParts(response.data);
    } catch (error) {
      console.error("Failed to fetch spare parts:", error.message);
    }
  };


  const handleAddRepairProcess = async (values) => {
    try {

      console.log("Form values received:", values);

      const payload = {
        p_id: values.p_id, 
        remarks: values.remarks,
        rep_date: values.rep_date,
        spare_parts: values.spare_parts,
      };
  

      console.log("Constructed payload:", payload);
  

      const response = await axios.post("http://localhost:4000/AddRepairProcess", payload);
  
      if (response.data.success) {
        console.log("Repair process added successfully");

        fetchAllDUM();
      } else {
        console.error("Error while adding repair process:", response.data.message);
      }
  
      return true;
    } catch (error) {
      console.error("Error in handleAddRepairProcess:", error.message);
      console.log("errrrrror");
      return false;
    }
  };
  

  const deleteRepairProcess = async (repId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/repair/${repId}`);

      if (response.status === 200) {
        message.success('Repair process deleted successfully!');
        fetchAllDUM();
      }
    } catch (error) {
      console.error('Error deleting repair process:', error);
      message.error('Failed to delete repair process.');
    }
  };

    const handleFinish = async(values) => {
      try {

        console.log("DUM data:", values);
  
        const payload = {
          serialnumber: values.serialnumber,
          productname: values.productname,
          //category: values.category,
          maintenanceStatus: values.maintenanceStatus,
        };
    
  
        console.log("Constructed payload:", payload);
    
  
        const response = await axios.post("http://localhost:4000/AddDUM", payload);
    
        if (response.data.success) {
          console.log("Device Under Maintenance added successfully");
  
          fetchAllDUM();
          fetchDevices();
        } else {
          console.error("Error while adding Device Under Maintenance:", response.data.message);
        }
    
        return true;
      } catch (error) {
        console.error("Error in handleDeviceUnderMaintenace:", error.message);
        console.log("errrrrror");
        return false;
      }
    };


    const handleRowClick = (record) => {
    setSelectedRepair(record);
    setdetailRepairModalVisible(true);
    console.log(selectedRepair);
    };

  useEffect(() => {
    fetchAllDUM();
    fetchDevices();
    fetchSpareParts();
  }, []);


  const DUMColumns = [
    {
      title: "Serial Number",
      dataIndex: "serial_number",
      key: "serial_number",
      ...getColumnSearchProps('serial_number'),
    },
    {
      title: "Product Name",
      dataIndex: "p_name",
      key: "p_name",
      ...getColumnSearchProps('p_name'),
    },
    {
      title: "Status",
      dataIndex: "p_status",
      key: "p_status",
      ...getColumnSearchProps('p_status'),
      render: (status) => {
        let color;
        switch (status) {
          case "Completed":
            color = "green";
            break;
          case "Under Maintenance":
            color = "blue";
            break;
          case "Pending":
            color = "gray";
            break;
          default:
            color = "black"; 
        }
        return <span style={{ color }}>{status}</span>;
      },
    },
    
  ];

  const columns = [
    {
      title: "Repair ID",
      dataIndex: "rep_id",
      key: "rep_id",
    },
    {
      title: "Repair Date",
      dataIndex: "rep_date",
      key: "rep_date",
    },
    {
      title: "Serial Number",
      dataIndex: "serial_number",
      key: "serial_number",
      ...getColumnSearchProps('serial_number'),
    },
    {
      title: "Product Name",
      dataIndex: "p_name",
      key: "p_name",
    },
    {
      title: "Status",
      dataIndex: "p_status",
      key: "p_status",
      render: (status) => {
        let color = status === "Completed" ? "green" : "blue";
        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      title: "Spare Parts Used",
      dataIndex: "spare_parts",
      key: "spare_parts",
      render: (spareParts) => {
        if (!spareParts || spareParts.length === 0) {
          return "No spare parts used"; // Handle null or empty array
        }
        return (
          <ul>
            {spareParts.map((sp, index) => (
              <li key={index}>
                {sp.sp_name} (Quantity: {sp.sp_quantity})
              </li>
            ))}
          </ul>
        );
      },
    },
  ];

  return (
    <div>
      <h2 style = {{textAlign: "left", fontWeight: "500"}}>Repair Process</h2>

      <AddRepairProcess
        handleFinish={handleAddRepairProcess}
        devices={devices}
        spareParts={spareParts}
        fetchSpareParts={fetchSpareParts}
        fetchDevices={fetchDevices}
      />


         <div className = "table-container">
             <Table
               dataSource={repairProcesses}
               showSorterTooltip={{
                 target: 'sorter-icon',
               }}
               rowKey={(record) => `${record.rep_id}-${record.sp_id}`} // Ensure rows have unique keys
               onRow={(record) => ({
                 onClick: () => handleRowClick(record),
               })}
               columns={columns}
               loading={loading}
               pagination={{ pageSize: 5 }}
             />
         </div>

              <div className="div" style={{position: "relative"}}>
           <h2 style = {{textAlign: "left", fontWeight: "500"}}>Device Under Maintenance</h2>
             <AddnewUnderMaintenance 
              handleFinish= {handleFinish}
             />

         <div className = "table-container" style={{}}>
             <Table
               dataSource={devices}
               showSorterTooltip={{
                 target: 'sorter-icon',
               }}
               columns={DUMColumns}
               pagination={{ pageSize: 5 }}
             />
         </div>

         </div>


        <RepairDetails
        selectedRepair= {selectedRepair}
        setSelectedRepair={setSelectedRepair}
        detailRepairModalVisible= {detailRepairModalVisible}
        handleModalClose={setdetailRepairModalVisible}
        fetchAllDUM = {fetchAllDUM}
        onDelete= {deleteRepairProcess}
        fetchSpareParts={fetchSpareParts}
         />
    </div>
  );
};

export default RepairProducts;
