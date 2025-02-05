import React, { useEffect, useState } from "react";
import { Bar } from "@ant-design/plots"; // Use only the Bar chart
import { Card, Row, Col } from "antd"; // Import Card and layout components
import "../../Styles/dashboardSM.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchSalesMarketingData } from "../../Store/Dashboards";

const DashBoardSM = () => {
  const dispatch = useDispatch();
  const {
    salesBarData,
    marketingBarData,
    salesTotalFromChart,
    totalMarketing,
    bestCustomers,
  } = useSelector((state) => state.Dashboards);

  useEffect(() => {
    dispatch(fetchSalesMarketingData());
  }, [dispatch]);

  // Configuration for Sales Bar Chart
  const barConfigSales = {
    data: salesBarData,
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

  // Configuration for Marketing Bar Chart
  const barConfigMarketing = {
    data: marketingBarData,
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
          <Card title="Total Sales" className="cardsales" bordered>
            <p>{salesTotalFromChart}</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Total Marketing" className="cardmarketing" bordered>
            <p>{totalMarketing}</p>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={12}>
          <Card>
            <h3>Sales Data (Top 10 - Bar Chart)</h3>
            <Bar {...barConfigSales} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <h3>Marketing Data (Top 10 - Bar Chart)</h3>
            <Bar {...barConfigMarketing} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Card
            title="Top 5 Customers with the Largest Difference in Sales and Marketing"
            bordered
          >
            <ul className="customer-list">
              {bestCustomers.map((customer, index) => (
                <li key={index} className="customer-item">
                  <div className="customer-info">
                    <strong className="customer-name">{customer.type}</strong>
                    <span className="customer-sales">
                      Sales: {customer.sales}
                    </span>
                    <span className="customer-marketing">
                      Marketing: {customer.marketing}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashBoardSM;
