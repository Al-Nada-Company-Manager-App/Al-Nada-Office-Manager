import { useEffect, useState } from "react";
import { Pie } from "@ant-design/plots";
import { useSelector,useDispatch } from "react-redux";
import { fetchRepairStatusData } from "../../../Store/Dashboards";

const RepairStatusChart = () => {
  const dispatch = useDispatch();
  const repairsData = useSelector((state) => state.Dashboards.repairStatusData);

  useEffect(() => {
    dispatch(fetchRepairStatusData());
  }, [dispatch]);

  const config = {
    data: repairsData,
    angleField: "status_count",
    colorField: "p_status",
    radius: 1,
    innerRadius: 0,
    legend: { position: "button" },
  };

  return ( 
  <div
  style={{
    width: "50%",
    height: "350px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
  }}
>
  <Pie {...config} />
</div>
);
};

export default RepairStatusChart;
