import { useEffect, useState } from "react";
import { Bar } from "@ant-design/plots";
import { useSelector, useDispatch } from "react-redux";
import { fetchTopProductsData } from "../../../Store/Dashboards";

const TopProductChart = () => {
  const dispatch = useDispatch();
  const topProducts = useSelector((state) => state.Dashboards.topProductsData);

  useEffect(() => {
    dispatch(fetchTopProductsData());
  }, [dispatch]);

  const config = {
    data: topProducts,
    xField: "type",
    yField: "value",
    seriesField: "type",
    legend: { position: "top-left" },
    barWidthRatio: 0.4,
    minBarWidth: 10,
    maxBarWidth: 20,
    xAxis: { nice: true, label: { autoHide: true, autoRotate: false } },
    yAxis: { label: { style: { fontSize: 12 } } },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "350px",
        margin: "0 auto",
      }}
    >
      <Bar {...config} />
    </div>
  );
};

export default TopProductChart;
