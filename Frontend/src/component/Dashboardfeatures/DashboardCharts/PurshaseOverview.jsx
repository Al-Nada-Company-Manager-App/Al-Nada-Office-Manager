import React, { useState, useEffect } from "react";
import { Line } from "@ant-design/plots";
import axios from "axios";

const PurchaseOverviewChart = () => {
  const [purchasesData, setPurchasesData] = useState([]);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const purchasesRes = await axios.get('http://localhost:4000/purchasesoverview');
            console.log('Parchase Response:', purchasesRes.data);
            setPurchasesData(purchasesRes.data.data); 
      } catch (error) {
        console.error("Error fetching overview data:", error);
      }
    };

    fetchOverviewData();
  }, []);

  const config = {
    data: purchasesData, // Correctly assign the array directly
    xField: "month", // Field representing months
    yField: "total_purchases", // Field representing sales numbers
    seriesField: "type", // Field to distinguish between data series
    legend: { position: "top-left" },
    barWidthRatio: 0.4,
    xAxis: {
      nice: true,
      label: { autoHide: true, autoRotate: false },
    },
    yAxis: {
      label: { style: { fontSize: 12 } },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "350px",
        margin: "0 auto",
      }}
    >
      <Line {...config} />
    </div>
  );
};

export default PurchaseOverviewChart;
