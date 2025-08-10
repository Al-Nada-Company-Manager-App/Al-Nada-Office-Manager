import "../../Styles/Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Statistic } from "antd";
import RepairStatusChart from "./DashboardCharts/RepairStatusChart";
import SparePartsChart from "./DashboardCharts/SparePartsChart";
import RepairsOverTimeChart from "./DashboardCharts/RepairOverTimeChart";
import SparePartsLowStock from "./DashboardCharts/SparePartsLowStock";
import {
  ToolOutlined,
  StopOutlined,
  RiseOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { fetchRepairTotals } from "../../Store/Dashboards";

const DashboardTCH = () => {
  const dispatch = useDispatch();
  const { totalRepairs, totalDUM, totalSpareParts, totalPending } = useSelector(
    (state) => state.Dashboards
  );

  useEffect(() => {
    dispatch(fetchRepairTotals());
  }, [dispatch]);

  return (
    <>
      <div style={{ padding: "20px", minHeight: "100vh" }}>
        <h2 style={{ textAlign: "left", fontWeight: "500" }}>Dashboard</h2>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card className="card-style" bordered>
              <Statistic
                prefix={<RiseOutlined />}
                title="Total Repairs"
                value={totalRepairs}
                valueStyle={{ color: "green" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-style" bordered>
              <Statistic
                title="Devices Under Maintenance"
                prefix={<ToolOutlined />}
                value={totalDUM}
                valueStyle={{ color: "#1677ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-style" bordered>
              <Statistic
                title="Spare Parts Used"
                value={totalSpareParts}
                prefix={<PlusCircleOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-style" bordered>
              <Statistic
                title="Pending"
                prefix={<StopOutlined />}
                value={totalPending}
                valueStyle={{ color: "red" }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={24}>
            <Card
              title="Repair Process Overview"
              bordered
              className="card-chart"
            >
              <RepairsOverTimeChart />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Card title="Spare Parts Usage" bordered className="card-chart">
              <SparePartsChart />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Low Stock Alerts" bordered className="card-chart">
              <SparePartsLowStock />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Card
              title="Repair Status Overview"
              bordered
              className="card-chart"
            >
              <RepairStatusChart />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default DashboardTCH;
