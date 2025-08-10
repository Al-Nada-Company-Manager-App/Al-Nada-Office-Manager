import { Row, Col, Card, Statistic } from "antd";
import { useEffect } from "react";
import TopProductChart from "./DashboardCharts/TopProduct";
import SalesOverviewChart from "./DashboardCharts/SalesOverview";
import PurchaseOverviewChart from "./DashboardCharts/PurshaseOverview";
import DebtsOverviewChart from "./DashboardCharts/DebtOverview";
import { useSelector, useDispatch } from "react-redux";
import { fetchSummaryTotals } from "../../Store/Dashboards";

const DashboardACT = () => {
  const dispatch = useDispatch();
  const { totalPurchase, totalSales, totalDebts } = useSelector(
    (state) => state.Dashboards
  );

  useEffect(() => {
    dispatch(fetchSummaryTotals());
  }, [dispatch]);

  return (
    <>
      <div style={{ padding: "20px", minHeight: "100vh" }}>
        <h2 style={{ textAlign: "left", fontWeight: "500" }}>
          Accountant Dashboard
        </h2>
        <Row
          gutter={[16, 16]}
          justify="center" // Center the columns horizontally
        >
          <Col span={6}>
            <Card className="card-style" bordered>
              <Statistic
                title="Total Sales"
                value={totalPurchase.toFixed(2)}
                valueStyle={{ color: "green" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-style" bordered>
              <Statistic
                title="Total Purchase"
                value={totalSales.toFixed(2)}
                valueStyle={{ color: "green" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="card-style" bordered>
              <Statistic
                title="Total Debts"
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
            <Card title="Debts Overview" bordered className="card-chart">
              <DebtsOverviewChart />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Top Products" bordered className="card-chart">
              <TopProductChart />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default DashboardACT;
