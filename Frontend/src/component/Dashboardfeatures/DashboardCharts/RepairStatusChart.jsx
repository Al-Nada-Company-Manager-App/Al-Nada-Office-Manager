import { useEffect, useState } from "react";
import { Pie } from "@ant-design/plots";
import axios from "axios";

const RepairStatusChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:4000/api/repair-status");
      setData(response.data);
    };
    fetchData();
  }, []);

  const config = {
    data,
    angleField: "status_count",
    colorField: "p_status",
    legend: { position: "bottom" },
  };

  return <Pie {...config} />;
};

export default RepairStatusChart;
