import React, { useState, useEffect } from "react";
import { Line } from "@ant-design/plots";
import { useSelector,useDispatch } from "react-redux";
import { fetchPurchaseOverviewData } from "../../../Store/Dashboards";

const PurchaseOverviewChart = () => {
  const dispatch = useDispatch();
  const purchasesData = useSelector((state) => state.Dashboards.purchasesData);

  useEffect(() => {
    dispatch(fetchPurchaseOverviewData());
  }, [dispatch]);

  const config = {
    data: purchasesData, 
    xField: "month", 
    yField: "total_purchases", 
    seriesField: "type", 
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
