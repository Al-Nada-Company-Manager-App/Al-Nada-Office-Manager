import { useEffect, useState } from "react";
import { Line } from "@ant-design/plots";
import { useSelector,useDispatch } from "react-redux";
import { fetchRepairsOverTime } from "../../../Store/Dashboards";

const RepairsOverTimeChart = () => {
  const dispatch = useDispatch();
  const repairsData = useSelector((state) => state.Dashboards.repairsOverTimeData);

  useEffect(() => {
    dispatch(fetchRepairsOverTime());
  }, [dispatch]);

  const config = {
    data: repairsData,
    xField: "rep_date",
    yField: "repairs_count",
    point: { size: 5, shape: "circle" },
    color: "#fa8c16",
  };

  return <Line {...config} />;
};

export default RepairsOverTimeChart;
