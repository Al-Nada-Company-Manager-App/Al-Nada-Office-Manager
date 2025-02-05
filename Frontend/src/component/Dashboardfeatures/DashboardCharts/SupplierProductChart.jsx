import { useEffect, useState } from "react";
import { Bar } from "@ant-design/plots";
import { useSelector, useDispatch } from "react-redux";
import { fetchSupplierProductData } from "../../../Store/Dashboards";

const SupplierProductChart = () => {
  const dispatch = useDispatch();
  const suppliersProducts = useSelector(
    (state) => state.Dashboards.supplierOverviewData
  );

  useEffect(() => {
    dispatch(fetchSupplierProductData());
  }, [dispatch]);

  const config = {
    data: suppliersProducts,
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

export default SupplierProductChart;
