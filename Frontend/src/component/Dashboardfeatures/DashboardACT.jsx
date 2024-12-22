
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Line, Bar } from '@ant-design/plots';

// const DashboardACT = () => {
//   const [salesData, setSalesData] = useState([]);
//   const [purchasesData, setPurchasesData] = useState([]);
//   const [debtsData, setDebtsData] = useState([]);
//   const [topSalesData, setTopSalesData] = useState([]);

//   useEffect(() => {
//     const fetchOverviewData = async () => {
//         try {
//             const salesRes = await axios.get('http://localhost:4000/salesoverview');
//             console.log('Sales Response:', salesRes.data);
//             setSalesData(salesRes.data.data);  
//             // const sortedSales = salesRes.data.data.sort((a, b) => b.total_sales - a.total_sales).slice(0, 5);
//             // setTopSalesData(sortedSales);
//             const purchasesRes = await axios.get('http://localhost:4000/purchasesoverview');
//             console.log('Parchase Response:', purchasesRes.data);
//             setPurchasesData(purchasesRes.data.data);  
//             // const sortedPurchase = purchasesRes.data.data.sort((a, b) => b.total_purchase - a.total_purchase).slice(0, 5);
//             // setTopSalesData(sortedPurchase);


//             const debtsRes = await axios.get('http://localhost:4000/debtsoverview');
//             console.log('Debts Response:', debtsRes.data);
//             setDebtsData(debtsRes.data.data);  
//             // const sortedDebts = debtsRes.data.data.sort((a, b) => b.total_debts - a.total_debts).slice(0, 5);
//             // setTopSalesData(sortedDebts);

//             const topProductsRes = await axios.get('http://localhost:4000/topproducts');
//             console.log('Product Response:', topProductsRes.data);
//             setTopSalesData(topProductsRes.data.data);  
//             // const sortedProduct = topProductsRes.data.data.sort((a, b) => b.total_debts - a.total_debts).slice(0, 5);
//             // setTopSalesData(sortedProduct);
//       } catch (error) {
//         console.error('Error fetching overview data:', error);
//       }
//     };

//     fetchOverviewData();
//   }, []);

//   const renderLineChart = (data, title,xfield,yfield) => (
//     <Line
//       data={data}
//       xField={xfield}
//       yField={yfield}
//       title={{
//         visible: true,
//         text: title,
//       }}
//       point={{
//         visible: true,
//         size: 5,
//         shape: 'circle',
//       }}
//       interactions={[{ type: 'marker-active' }]}
//     />
//   );


  

//   const renderBarChart = (data, title) => (
//     <Bar
//       data={data}
//       xField="p_name"
//       yField="total_sale"
//       title={{
//         visible: true,
//         text: title,
//       }}
//       interactions={[{ type: 'active-region' }]}
//     />
//   );

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Accountant Dashboard</h1>
//       <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
//         <div style={{ width: '45%', marginBottom: '20px' }}>
//           <h2>Sales Overview</h2>
//           {renderLineChart(salesData, 'Sales Data','month','total_sales')}
//         </div>
//         <div style={{ width: '45%', marginBottom: '20px' }}>
//           <h2>Purchases Overview</h2>
//           {renderLineChart(purchasesData, 'Purchases Data','month','total_purchases')}
//         </div>
//         <div style={{ width: '45%', marginBottom: '20px' }}>
//           <h2>Debts Overview</h2>
//           {renderLineChart(debtsData, 'Debts Data','d_type','total_debt')}
//         </div>
//         <div style={{ width: '45%', marginBottom: '20px' }}>
//           <h2>Top 5 Products Sold</h2>
//           {renderBarChart(topSalesData, 'Top Sales Data')}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardACT;




import { Row, Col, Card, Statistic } from "antd";
import {StopOutlined} from '@ant-design/icons';
import {useState, useEffect} from "react";
import axios from "axios";
import TopProductChart from "./DashboardCharts/TopProduct";
import SalesOverviewChart from "./DashboardCharts/SalesOverview";
import PurchaseOverviewChart from "./DashboardCharts/PurshaseOverview";
import DebtsOverviewChart from "./DashboardCharts/DebtOverview";
const DashboardACT = () => {

    const [TotalSales , setTotalSales] = useState([]);
    const [TotalPurchase , setTotalPurchase] = useState([]);
    const [TotalDebts , setTotalDebts] = useState([]);

  
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
        value={TotalPurchase} 
        valueStyle={{ color: "green" }} 
      />
    </Card>
  </Col>
  <Col span={6}>
    <Card className="card-style" bordered>
      <Statistic 
        title="Total Purchase" 
        value={TotalSales} 
        valueStyle={{ color: "green" }} 
      />
    </Card>
  </Col>
  <Col span={6}>
    <Card className="card-style" bordered>
      <Statistic 
        title="Total Debts" 
        value={TotalDebts} 
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


