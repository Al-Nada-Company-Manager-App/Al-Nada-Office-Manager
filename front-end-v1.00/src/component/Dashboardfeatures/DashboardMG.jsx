import { Row, Col, Card, Statistic } from "antd";
import {useEffect } from "react";
import StockCategoryChart from "./DashboardCharts/StockCategoryChart";
import CustomerProductChart from "./DashboardCharts/CustomerProductChart";
import SupplierProductChart from "./DashboardCharts/SupplierProductChart";
import TopProductChart from "./DashboardCharts/TopProduct";
import SalesOverviewChart from "./DashboardCharts/SalesOverview";
import PurchaseOverviewChart from "./DashboardCharts/PurshaseOverview";
import DebtsOverviewChart from "./DashboardCharts/DebtOverview";
import { useSelector, useDispatch } from "react-redux";
import { fetchSummaryTotals } from "../../Store/Dashboards";

const DashboardMG = () => {
  const dispatch = useDispatch();
  const { totalStock, totalPurchase, totalSales, totalDebts } = useSelector(
    (state) => state.Dashboards
  );


  useEffect(() => {
    dispatch(fetchSummaryTotals());
  }, [dispatch]);

  return (
    <>
      <div style={{ padding: "20px", minHeight: "100vh" }}>
        <h2 style={{ textAlign: "left", fontWeight: "500" }}>Dashboard</h2>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card className="card-style" bordered>
              <Statistic
                //prefix= {<RiseOutlined />}
                title="Total Stock"
                value={totalStock}
                valueStyle={{ color: "green" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-style" bordered>
              <Statistic
                title="Total Sales"
                //prefix= {<ToolOutlined />}
                value={totalPurchase.toFixed(2)}
                valueStyle={{ color: "green" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-style" bordered>
              <Statistic
                title="Total Parchase"
                value={totalSales.toFixed(2)}
                //prefix= {<PlusCircleOutlined />}
                valueStyle={{ color: "green" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-style" bordered>
              <Statistic
                title="Total Debts"
                //prefix= {<StopOutlined />}
                value={totalDebts.toFixed(2)}
                valueStyle={{ color: "green" }}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Card title="Sales Overview" bordered className="card-chart">
              <SalesOverviewChart />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Purchase Overview" bordered className="card-chart">
              <PurchaseOverviewChart />
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Card title="Top Products" bordered className="card-chart">
              <TopProductChart />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Customer Products" bordered className="card-chart">
              <CustomerProductChart />
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Card title="Stock Categories" bordered className="card-chart">
              <StockCategoryChart />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Supplier Products" bordered className="card-chart">
              <SupplierProductChart />
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Card title="Debts Overview" bordered className="card-chart">
              <DebtsOverviewChart />
            </Card>
          </Col>
          {/* <Col span={12}>
            <Card
              title="Customer Products"
              bordered
              className="card-chart"
              >
              <CustomerProductChart />
            </Card>
          </Col> */}
        </Row>
      </div>
    </>
  );
};
export default DashboardMG;
