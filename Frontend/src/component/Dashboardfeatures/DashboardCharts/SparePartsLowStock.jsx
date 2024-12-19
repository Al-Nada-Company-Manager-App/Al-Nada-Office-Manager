import { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";

const SparePartsLowStock = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:4000/api/low-stock-alert");
      setData(response.data);
    };
    fetchData();
  }, []);

  const columns = [
    { title: "Spare Part Name", dataIndex: "p_name", key: "p_name" },
    { title: "Available Quantity", dataIndex: "p_quantity", key: "p_quantity" },
  ];

  return <Table dataSource={data} columns={columns} rowKey="p_name" />;
};

export default SparePartsLowStock;
