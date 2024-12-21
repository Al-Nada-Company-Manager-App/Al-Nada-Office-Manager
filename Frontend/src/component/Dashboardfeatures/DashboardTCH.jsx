import "../../Styles/Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Statistic } from "antd";
import RepairStatusChart from "./DashboardCharts/RepairStatusChart";
import SparePartsChart from "./DashboardCharts/SparePartsChart";
import RepairsOverTimeChart from "./DashboardCharts/RepairOverTimeChart";
import SparePartsLowStock from "./DashboardCharts/SparePartsLowStock";
import {ToolOutlined, StopOutlined, RiseOutlined, PlusCircleOutlined} from '@ant-design/icons';


const DashboardTCH = () => {

  const [TotalRepairs , setTotalRepairs] = useState([]);
  const [TotalDUM, setTotalDUM] = useState([]);
  const [TotalSpareParts, setTotalSpareParts] = useState([]);
  const [TotalPending, setTotalPending] = useState([]);

  useEffect(() => {

    axios.get("http://localhost:4000/api/total-repairs")
      .then((res) => setTotalRepairs(res.data.totalRepairs))
      .catch((err) => console.error("Error fetching total repairs:", err));


    axios.get("http://localhost:4000/api/total-DUM")
      .then((res) => setTotalDUM(res.data.totalDUM))
      .catch((err) => console.error("Error fetching total dum:", err));


      axios.get("http://localhost:4000/api/total-spare-parts")
      .then((res) => setTotalSpareParts(res.data.totalSpare))
      .catch((err) => console.error("Error fetching total spare part:", err));
      

      axios.get("http://localhost:4000/api/total-pending")
      .then((res) => setTotalPending(res.data.totalpending))
      .catch((err) => console.error("Error fetching total pending:", err));
  }, []);




  return (
    <>
    <div style={{ padding: "20px", minHeight: "100vh" }}>
    <h2 style = {{textAlign: "left", fontWeight: "500"}}>Dashboard</h2>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card 
          className="card-style" bordered >
            <Statistic 
            prefix= {<RiseOutlined />}
            title="Total Repairs" 
            value={TotalRepairs} 
            valueStyle={{ color: "green" }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card-style" bordered>
            <Statistic 
            title="Devices Under Maintenance" 
            prefix= {<ToolOutlined />}
            value={TotalDUM} 
            valueStyle={{ color: "#1677ff" }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card-style" bordered >
            <Statistic 
            title="Spare Parts Used" 
            value={TotalSpareParts} 
            prefix= {<PlusCircleOutlined />}
            valueStyle={{ color: "#cf1322" }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card-style" bordered >
            <Statistic 
            title="Pending" 
            prefix= {<StopOutlined />}
            value={TotalPending}
            valueStyle={{ color: "red" }} />
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
          <Card
            title="Spare Parts Usage"
            bordered
            className="card-chart"
          >
            <SparePartsChart />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Low Stock Alerts"
            bordered
            className="card-chart"
            >
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

export default DashboardTCH
;

