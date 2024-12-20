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
    barWidthRatio: 0.4,
    minBarWidth: 10,
    maxBarWidth: 20,
    padding: [20, 30, 20, 30],
    xAxis: { nice: true, label: { autoHide: true, autoRotate: false } },
    yAxis: { label: { style: { fontSize: 12 } } },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        margin: "0 auto",
      }}
    >
      <Bar {...config} />
    </div>
  );
};

export default SparePartsChart;
