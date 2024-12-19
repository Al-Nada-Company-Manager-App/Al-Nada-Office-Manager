import { useEffect, useState } from "react";
import { Bar } from "@ant-design/plots";
import axios from "axios";

const SparePartsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:4000/api/spare-parts-used");
      setData(response.data);
      console.log(response.data);
    };
    fetchData();
  }, []);

  const config = {
    data,
    xField: "total_used",
    yField: "spare_part_name",
    seriesField: "spare_part_name",
    color: "#1890ff",
  };

  return <Bar {...config} />;
};

export default SparePartsChart;
