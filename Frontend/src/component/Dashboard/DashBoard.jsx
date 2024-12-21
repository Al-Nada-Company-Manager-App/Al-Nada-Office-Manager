// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Line, Pie, Bar } from '@ant-design/plots';

// const Dashboard = () => {
//   const [salesData, setSalesData] = useState([]);
//   const [purchasesData, setPurchasesData] = useState([]);
//   const [debtsData, setDebtsData] = useState([]);

//   useEffect(() => {
//     const fetchOverviewData = async () => {
//       try {
//         const salesRes = await axios.get('http://localhost:4000/salesoverview');
//         setSalesData(salesRes.data.totals);

//         const purchasesRes = await axios.get('http://localhost:4000/purchasesoverview');
//         setPurchasesData(purchasesRes.data.categories);

//         const debtsRes = await axios.get('http://localhost:4000/debtsoverview');
//         setDebtsData(debtsRes.data.types);
//       } catch (error) {
//         console.error('Error fetching overview data:', error);
//       }
//     };

//     fetchOverviewData();
//   }, []);

//   const renderPieChart = (data, title) => (
//     <Pie
//       data={data}
//       angleField="value"
//       colorField="type"
//       radius={0.8}
//       label={{
//         type: 'spider',
//         content: '{name} ({percentage})',
//       }}
//       interactions={[{ type: 'element-active' }]}
//       legend={{
//         position: 'bottom',
//       }}
//       title={{ visible: true, text: title }}
//     />
//   );

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Accountant Dashboard</h1>
//       <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
//         <div style={{ width: '30%', marginBottom: '20px' }}>
//           <h2>Sales Overview</h2>
//           {renderPieChart(salesData, 'Sales Data')}
//         </div>
//         <div style={{ width: '30%', marginBottom: '20px' }}>
//           <h2>Purchases Overview</h2>
//           {renderPieChart(purchasesData, 'Purchases Data')}
//         </div>
//         <div style={{ width: '30%', marginBottom: '20px' }}>
//           <h2>Debts Overview</h2>
//           {renderPieChart(debtsData, 'Debts Data')}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from '@ant-design/plots';

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [purchasesData, setPurchasesData] = useState([]);
  const [debtsData, setDebtsData] = useState([]);
  const [topSalesData, setTopSalesData] = useState([]);

  useEffect(() => {
    const fetchOverviewData = async () => {
        try {
            const salesRes = await axios.get('http://localhost:4000/salesoverview');
            console.log('Sales Response:', salesRes.data);
            setSalesData(salesRes.data.data);  
            const sortedSales = salesRes.data.data.sort((a, b) => b.total_sales - a.total_sales).slice(0, 5);
            setTopSalesData(sortedSales);
            const purchasesRes = await axios.get('http://localhost:4000/purchasesoverview');
            console.log('Parchase Response:', purchasesRes.data);
            setPurchasesData(purchasesRes.data.data);  
            const sortedPurchase = purchasesRes.data.data.sort((a, b) => b.total_purchase - a.total_purchase).slice(0, 5);
            setTopSalesData(sortedPurchase);


            const debtsRes = await axios.get('http://localhost:4000/debtsoverview');
            console.log('Debts Response:', debtsRes.data);
            setDebtsData(debtsRes.data.data);  
            const sortedDebts = debtsRes.data.data.sort((a, b) => b.total_debts - a.total_debts).slice(0, 5);
            setTopSalesData(sortedDebts);

            const topProductsRes = await axios.get('http://localhost:4000/topproducts');
            console.log('Product Response:', topProductsRes.data);
            setDebtsData(topProductsRes.data.data);  
            const sortedProduct = topProductsRes.data.data.sort((a, b) => b.total_debts - a.total_debts).slice(0, 5);
            setTopSalesData(sortedProduct);
      } catch (error) {
        console.error('Error fetching overview data:', error);
      }
    };

    fetchOverviewData();
  }, []);

  const renderLineChart = (data, title,xfield,yfield) => (
    <Line
      data={data}
      xField={xfield}
      yField={yfield}
      title={{
        visible: true,
        text: title,
      }}
      point={{
        visible: true,
        size: 5,
        shape: 'circle',
      }}
      interactions={[{ type: 'marker-active' }]}
    />
  );


  

  const renderBarChart = (data, title) => (
    <Bar
      data={data}
      xField="p_name"
      yField="total_sale"
      title={{
        visible: true,
        text: title,
      }}
      interactions={[{ type: 'active-region' }]}
    />
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>Accountant Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <div style={{ width: '45%', marginBottom: '20px' }}>
          <h2>Sales Overview</h2>
          {renderLineChart(salesData, 'Sales Data','month','total_sales')}
        </div>
        <div style={{ width: '45%', marginBottom: '20px' }}>
          <h2>Purchases Overview</h2>
          {renderLineChart(purchasesData, 'Purchases Data','month','total_purchases')}
        </div>
        <div style={{ width: '45%', marginBottom: '20px' }}>
          <h2>Debts Overview</h2>
          {renderLineChart(debtsData, 'Debts Data','d_type','total_debt')}
        </div>
        <div style={{ width: '45%', marginBottom: '20px' }}>
          <h2>Top 5 Products Sold</h2>
          {renderBarChart(topSalesData, 'Top Sales Data')}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


