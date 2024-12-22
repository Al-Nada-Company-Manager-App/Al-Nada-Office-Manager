import React, { useEffect, useState } from "react";
import { Bar } from "@ant-design/plots"; // Use only the Bar chart
import { Card, Row, Col } from "antd"; // Import Card and layout components
import axiosInstance from "../../Utils/axiosInstance";
import "../../Styles/dashboardSM.css";

const DashBoardSM = () => {
  const [dataBar, setDataBar] = useState([]);
  const [dataMarketingBar, setDataMarketingBar] = useState([]); // Marketing bar data
  const [totalSales, setTotalSales] = useState(0);
  const [totalMarketing, setTotalMarketing] = useState(0);
  const [bestCustomers, setBestCustomers] = useState([]); // Top 5 customers with the largest difference

  const fetchData = async () => {
    try {
      // Fetch sales data for the bar chart
      const salesResponse = await axiosInstance.get("/getcustomersales");
      const salesData = salesResponse.data.map((item) => ({
        type: `${item.c_name}`,
        value: Number(item.salescount),
      }));
  
      // Calculate total sales count (sum of all sales data, not top 5)
      const totalSalesCount = salesData.reduce(
        (acc, cur) => acc + cur.value,
        0
      );
      setTotalSales(totalSalesCount);
  
      // Fetch marketing data for the bar chart
      const marketingResponse = await axiosInstance.get("/getcustomermarkets");
      const marketingData = marketingResponse.data.map((item) => ({
        type: `${item.c_name}`,
        value: Number(item.marketing_count),
      }));
  
      // Calculate total marketing count (sum of all marketing data, not top 5)
      const totalMarketingCount = marketingData.reduce(
        (acc, cur) => acc + cur.value,
        0
      );
      setTotalMarketing(totalMarketingCount);
  
      // Now calculate the difference between sales and marketing for each customer
      const customersWithDifference = salesData.map((salesItem) => {
        const marketingItem = marketingData.find(
          (marketingItem) => marketingItem.type === salesItem.type
        );
        const difference = Math.abs(
          salesItem.value - marketingItem?.value || 0
        ); // Absolute difference
        return {
          type: salesItem.type,
          sales: salesItem.value,
          marketing: marketingItem?.value || 0,
          difference: difference,
        };
      });
  
      // Sort the customers by the largest difference and take the top 5
      const top5Customers = customersWithDifference
        .sort((a, b) => b.difference - a.difference)
        .slice(0, 5);
      setBestCustomers(top5Customers);
  
      // Sort the sales data in descending order and take the top 10
      const sortedSalesData = salesData
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
      setDataBar(sortedSalesData);
  
      // Sort the marketing data in ascending order and take the top 10
      const sortedMarketingData = marketingData
        .sort((a, b) => a.value - b.value) // Ascending order
        .slice(0, 10);
      setDataMarketingBar(sortedMarketingData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  // Configuration for Sales Bar Chart
  const barConfigSales = {
    data: dataBar,
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
    data: dataMarketingBar,
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
            <p>{totalSales}</p>
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
