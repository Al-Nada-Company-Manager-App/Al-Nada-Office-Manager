import { useEffect, useState } from "react";
import { Bar } from "@ant-design/plots";
import {useSelector,useDispatch} from "react-redux";  
import { fetchSparePartsData } from "../../../Store/Dashboards";

const SparePartsChart = () => {
  const dispatch = useDispatch();
  const sparePartsData = useSelector(state => state.Dashboards.sparesData);

  useEffect(() => {
    dispatch(fetchSparePartsData());
  }, [dispatch]);
    

  const config = {
    data: sparePartsData,
    xField: "spare_part_name",
    yField: "total_used",
    seriesField: "total_used",
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
