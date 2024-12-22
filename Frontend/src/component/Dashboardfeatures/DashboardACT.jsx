
import { Row, Col, Card, Statistic } from "antd";
import {StopOutlined} from '@ant-design/icons';
import {useState, useEffect} from "react";
import axios from "axios";
import TopProductChart from "./DashboardCharts/TopProduct";
import SalesOverviewChart from "./DashboardCharts/SalesOverview";
import PurchaseOverviewChart from "./DashboardCharts/PurshaseOverview";
import DebtsOverviewChart from "./DashboardCharts/DebtOverview";
const DashboardACT = () => {

    const [TotalSales , setTotalSales] = useState(0);
    const [TotalPurchase , setTotalPurchase] = useState(0);
    const [TotalDebts , setTotalDebts] = useState(0);

  
    useEffect(() => {
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
      <h2 style = {{textAlign: "left", fontWeight: "500"}}>Accountant Dashboard</h2>
      <Row 
  gutter={[16, 16]} 
  justify="center" // Center the columns horizontally
>
  <Col span={6}>
    <Card className="card-style" bordered>
      <Statistic 
        title="Total Sales" 
        value={TotalPurchase.toFixed(2)} 
        valueStyle={{ color: "green" }} 
      />
    </Card>
  </Col>
  <Col span={6}>
    <Card className="card-style" bordered>
      <Statistic 
        title="Total Purchase" 
        value={TotalSales.toFixed(2)} 
        valueStyle={{ color: "green" }} 
      />
    </Card>
  </Col>
  <Col span={6}>
    <Card className="card-style" bordered>
      <Statistic 
        title="Total Debts" 
        value={TotalDebts.toFixed(2)} 
        valueStyle={{ color: "green" }} 
      />
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
              title="Debts Overview"
              bordered
              className="card-chart"
              >
              <DebtsOverviewChart />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="Top Products"
              bordered
              className="card-chart"
              >
              <TopProductChart />
            </Card>
          </Col>
        </Row>
       
        

      </div>
      </>
      );
};
export default DashboardACT;


