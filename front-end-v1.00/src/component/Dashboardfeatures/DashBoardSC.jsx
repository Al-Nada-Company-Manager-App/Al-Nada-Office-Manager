import React, { useEffect, useState } from "react";
import { Bar } from "@ant-design/plots";
import { Card, Row, Col } from "antd";
import axiosInstance from "../../Utils/axiosInstance";
import "../../Styles/dashboardSM.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchCustomerSupplierData } from "../../Store/Dashboards";

const DashBoardSC = () => {

  const dispatch = useDispatch();
  const { totalCustomers, totalSuppliers, topPayingCustomers, topRepairedProducts, productsInStock, topSoldProducts } = useSelector(state => state.Dashboards);


  useEffect(() => {
    dispatch(fetchCustomerSupplierData());
  }, [dispatch]);

  // Bar chart configuration for top-paying customers
  const barConfigTopCustomers = {
    data: topPayingCustomers,
    xField: "value",
    yField: "type",
    colorField: "type",
    label: {
      position: "middle",
      style: { fill: "#FFFFFF", opacity: 0.7 },
    },
    state: {
      unselected: { opacity: 0.5 },
      selected: { lineWidth: 2, stroke: "#ff4d4f" },
    },
    interactions: [{ type: "element-selected" }, { type: "active-region" }],
    height: 200,
  };

  // Bar chart configuration for most repaired products
  const barConfigRepairedProducts = {
    data: topRepairedProducts,
    xField: "value",
    yField: "type",
    colorField: "type",
    label: {
      position: "middle",
      style: { fill: "#FFFFFF", opacity: 0.7 },
    },
    state: {
      unselected: { opacity: 0.5 },
      selected: { lineWidth: 2, stroke: "#ff4d4f" },
    },
    interactions: [{ type: "element-selected" }, { type: "active-region" }],
    height: 200,
  };

  // Bar chart configuration for most sold products
  const barConfigSoldProducts = {
    data: topSoldProducts,
    xField: "value",
    yField: "type",
    colorField: "type",
    label: {
      position: "middle",
      style: { fill: "#FFFFFF", opacity: 0.7 },
    },
    state: {
      unselected: { opacity: 0.5 },
      selected: { lineWidth: 2, stroke: "#ff4d4f" },
    },
    interactions: [{ type: "element-selected" }, { type: "active-region" }],
    height: 200,
  };

  return (
    <div className="dashboardsm">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Total Customers" className="card-customers" bordered>
            <p>{totalCustomers}</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Total Suppliers" className="card-suppliers" bordered>
            <p>{totalSuppliers}</p>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }} className="hover">
        <Col span={24}>
          <Card>
            <h3>Customers payment</h3>
            <Bar {...barConfigTopCustomers} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={12}>
          <Card>
            <h3>Products Repaired</h3>
            <Bar {...barConfigRepairedProducts} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <h3>Products Sold</h3>
            <Bar {...barConfigSoldProducts} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Card title="Total Products in Stock" bordered>
            <p>{productsInStock}</p>
          </Card>
        </Col>
        {/* <Col span={24}>
          <Card title="Total Debts" bordered>
            <p>{totalDebs}</p>
          </Card>
        </Col> */}
      </Row>
    </div>
  );
};

export default DashBoardSC;
