import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import axios from "axios";

const DebtsOverviewChart = () => {
  const [debtsData, setDebtsData] = useState([]);

  useEffect(() => {
    const fetchOverviewData = async () => {
        try {
          const debtsRes = await axios.get("http://localhost:4000/debtsoverview");
          console.log("Debts Response:", debtsRes.data);
      
          const processedData = (debtsRes.data.data || []).map((item) => {
            if (["DEBT_IN", "INSURANCE"].includes(item.d_type)) {
              return { ...item, total_debt: Math.abs(item.total_debt) };
            }
            return item;
          });
      
          setDebtsData(processedData);
        } catch (error) {
          console.error("Error fetching overview data:", error);
        }
      };

    fetchOverviewData();
  }, []);

  const config = {
    data: debtsData,
    xField: "d_type", // Field representing debt type
    yField: "total_debt", // Field representing total debt
    legend: { position: "top-left" },
    xAxis: {
      nice: true,
      label: { autoHide: true, autoRotate: false },
    },
    yAxis: {
      label: { style: { fontSize: 12 } },
    },
    columnWidthRatio: 0.4, // Better visual spacing for columns
  };

  return (
    <div
      style={{
        width: "100%",
        height: "350px",
        margin: "0 auto",
      }}
    >
      {debtsData.length > 0 ? (
        <Column {...config} />
      ) : (
        <p style={{ textAlign: "center" }}>Loading data...</p>
      )}
    </div>
  );
};

export default DebtsOverviewChart;
