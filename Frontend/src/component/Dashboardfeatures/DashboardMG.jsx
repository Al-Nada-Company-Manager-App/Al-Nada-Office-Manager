import { Row, Col, Card, Statistic } from "antd";
import {StopOutlined} from '@ant-design/icons';
import {useState, useEffect} from "react";
import StockCategoryChart from './DashboardCharts/StockCategoryChart';
import axios from "axios";
import CustomerProductChart from './DashboardCharts/CustomerProductChart';
import SupplierProductChart from "./DashboardCharts/SupplierProductChart";
import TopProductChart from "./DashboardCharts/TopProduct";
import SalesOverviewChart from "./DashboardCharts/SalesOverview";
import PurchaseOverviewChart from "./DashboardCharts/PurshaseOverview";
const DashboardMG = () => {

    const [TotalStock , setTotalStock] = useState([]);
    const [TotalSales , setTotalSales] = useState([]);
    const [TotalPurchase , setTotalPurchase] = useState([]);
    const [TotalDebts , setTotalDebts] = useState([]);

  
    useEffect(() => {
  
      axios.get("http://localhost:4000/api/total-stock")
        .then((res) => setTotalStock(res.data))
        .catch((err) => console.error("Error fetching total stock:", err));


        axios.get("http://localhost:4000/api/total-purchase")
        .then((res) => setTotalPurchase(res.data))
        .catch((err) => console.error("Error fetching total stock:", err));



        axios.get("http://localhost:4000/api/total-sales")
        .then((res) => setTotalSales(res.data))
        .catch((err) => console.error("Error fetching total stock:", err));



        axios.get("http://localhost:4000/api/total-debts")
        .then((res) => setTotalDebts(res.data))
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
              title="Total Sales" 
              //prefix= {<ToolOutlined />}
              value={TotalPurchase} 
              valueStyle={{ color: "green" }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-style" bordered >
              <Statistic 
              title="Total Parchase" 
              value={TotalSales} 
              //prefix= {<PlusCircleOutlined />}
              valueStyle={{ color: "green" }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-style" bordered >
              <Statistic 
              title="Total Debts" 
              //prefix= {<StopOutlined />}
              value={TotalDebts}
              valueStyle={{ color: "green" }} />
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Card
              title="Sales Overview"
              bordered
              className="card-chart"
              >
              <SalesOverviewChart />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="Purchase Overview"
              bordered
              className="card-chart"
              >
              <PurchaseOverviewChart />
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
              title="Top Products"
              bordered
              className="card-chart"
              >
              <TopProductChart />
            </Card>
          </Col>
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


