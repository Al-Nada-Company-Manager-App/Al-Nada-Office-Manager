import { Row, Col, Card, Statistic } from "antd";
import {StopOutlined} from '@ant-design/icons';
import {useState, useEffect} from "react";
import StockCategoryChart from './DashboardCharts/StockCategoryChart';
import axios from "axios";
import CustomerProductChart from './DashboardCharts/CustomerProductChart';
import SupplierProductChart from "./DashboardCharts/SupplierProductChart";

const DashboardMG = () => {

    const [TotalStock , setTotalStock] = useState([]);
  
    useEffect(() => {
  
      axios.get("http://localhost:4000/api/total-stock")
        .then((res) => setTotalStock(res.data))
        .catch((err) => console.error("Error fetching total stock:", err));

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
              //prefix= {<RiseOutlined />}
              title="Total Stock" 
              value={TotalStock} 
              valueStyle={{ color: "green" }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-style" bordered>
              <Statistic 
              title="" 
              //prefix= {<ToolOutlined />}
              //value={TotalDUM} 
              valueStyle={{ color: "#1677ff" }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-style" bordered >
              <Statistic 
              title="" 
              //value={TotalSpareParts} 
              //prefix= {<PlusCircleOutlined />}
              valueStyle={{ color: "#cf1322" }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-style" bordered >
              <Statistic 
              title="" 
              prefix= {<StopOutlined />}
              //value={TotalPending}
              valueStyle={{ color: "red" }} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Card
              title="Stock Categories"
              bordered
              className="card-chart"
              >
              <StockCategoryChart />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="Supplier Products"
              bordered
              className="card-chart"
              >
              <SupplierProductChart />
            </Card>
          </Col>
        </Row>
  
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Card
              title="Customer Products"
              bordered
              className="card-chart"
              >
              <CustomerProductChart />
            </Card>
          </Col>
        </Row>
      </div>
      </>
      );
};
export default DashboardMG;


