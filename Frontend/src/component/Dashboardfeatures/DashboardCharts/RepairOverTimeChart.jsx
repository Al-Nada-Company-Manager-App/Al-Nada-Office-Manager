import { useEffect, useState } from "react";
import { Line } from "@ant-design/plots";
import axios from "axios";

const RepairsOverTimeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:4000/api/repairs-over-time");
      setData(response.data);
    };
    fetchData();
  }, []);

  const config = {
    data,
    xField: "rep_date",
    yField: "repairs_count",
    point: { size: 5, shape: "circle" },
    color: "#fa8c16",
  };

  return <Line {...config} />;
};

export default RepairsOverTimeChart;
