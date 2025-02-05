import { useEffect, useState } from "react";
import { Table } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchSparePartsLowStock } from "../../../Store/Dashboards";

const SparePartsLowStock = () => {
  const dispatch = useDispatch();
  const sparePartsLowStock = useSelector(
    (state) => state.Dashboards.sparesLowData
  );

  useEffect(() => {
    dispatch(fetchSparePartsLowStock());
  }, [dispatch]);

  const columns = [
    { title: "Spare Part Name", dataIndex: "p_name", key: "p_name" },
    { title: "Available Quantity", dataIndex: "p_quantity", key: "p_quantity" },
  ];

  return (
    <>
      <div style={{ height: "300px" }}>
        <Table
          dataSource={sparePartsLowStock}
          columns={columns}
          rowKey="p_name"
        />
      </div>
    </>
  );
};

export default SparePartsLowStock;
