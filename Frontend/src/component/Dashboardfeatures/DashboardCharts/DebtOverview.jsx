import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { useSelector, useDispatch } from "react-redux";
import { fetchDebtOverviewDate } from "../../../Store/Dashboards";

const DebtsOverviewChart = () => {
  const dispatch = useDispatch();
  const debtsData = useSelector((state) => state.Dashboards.debtsData);

  useEffect(() => {
    dispatch(fetchDebtOverviewDate());
  }, [dispatch]);

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
