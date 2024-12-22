import React, { useEffect, useState } from "react";
import { Bar } from "@ant-design/plots";
import { Card, Row, Col } from "antd";
import axiosInstance from "../../Utils/axiosInstance";
import "../../Styles/dashboardSM.css";

const DashBoardSC = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [topPayingCustomers, setTopPayingCustomers] = useState([]);
  const [topRepairedProducts, setTopRepairedProducts] = useState([]);
  const [productsInStock, setProductsInStock] = useState(0);
  const [topSoldProducts, setTopSoldProducts] = useState([]);
 // const [totalDebs, setTotalDebs] = useState(0);

  const fetchData = async () => {
    try {
      // Fetch total number of customers
      const customersResponse = await axiosInstance.get("/getcustomerscount");
      setTotalCustomers(customersResponse.data.count);
      // Fetch total number of suppliers
      //const totalDebsResponse = await axiosInstance.get("/gettotaldebts");
        //setTotalDebs(totalDebsResponse.data.count);
      const suppliersResponse = await axiosInstance.get("/getsupplierscount");
      setTotalSuppliers(suppliersResponse.data.count);
      // Fetch top 5 customers who paid the most
      const topCustomersResponse = await axiosInstance.get("/gettopcustomers");
      const topCustomersData = topCustomersResponse.data.map((item) => ({
        type: `${item.c_name}`,
        value: Number(item.total_paid),
      }));
      setTopPayingCustomers(topCustomersData);

      // Fetch top 5 products repaired most frequently
      const repairedProductsResponse = await axiosInstance.get(
        "/gettoprepairedproducts"
      );
      const repairedProductsData = repairedProductsResponse.data.map((item) => ({
        type: `${item.p_name}`,
        value: Number(item.repair_count),
      }));
      setTopRepairedProducts(repairedProductsData);

      // Fetch total number of products in stock
      const stockResponse = await axiosInstance.get("/getproductscount");
      setProductsInStock(stockResponse.data.count);

      // Fetch top 5 products sold most frequently
      const topSoldResponse = await axiosInstance.get("/gettopsoldproducts");
      const topSoldData = topSoldResponse.data.map((item) => ({
        type: `${item.p_name}`,
        value: Number(item.sales_count),
      }));
      setTopSoldProducts(topSoldData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Bar chart configuration for top-paying customers
  const barConfigTopCustomers = {
    data: topPayingCustomers,
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

  // Bar chart configuration for most repaired products
  const barConfigRepairedProducts = {
    data: topRepairedProducts,
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

  // Bar chart configuration for most sold products
  const barConfigSoldProducts = {
    data: topSoldProducts,
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
          <Card title="Total Customers" className="card-customers" bordered>
            <p>{totalCustomers}</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Total Suppliers" className="card-suppliers" bordered>
            <p>{totalSuppliers}</p>
          </Card>
        </Col>
      </Row>

      <Row 
        gutter={[16, 16]} 
        style={{ marginTop: "20px" }} 
        className="hover"
      >
        <Col span={24}>
        <Card>

          <h3>Customers payment</h3>
          <Bar {...barConfigTopCustomers} />
          </Card>

        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={12}>
        <Card>
          <h3>Products Repaired</h3>
          <Bar {...barConfigRepairedProducts} />
          </Card>
        </Col>
        <Col span={12}>
        <Card>
          <h3>Products Sold</h3>
          <Bar {...barConfigSoldProducts} />
          </Card>

        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Card title="Total Products in Stock" bordered>
            <p>{productsInStock}</p>
          </Card>
        </Col>
        {/* <Col span={24}>
          <Card title="Total Debts" bordered>
            <p>{totalDebs}</p>
          </Card>
        </Col> */}
      </Row>
    </div>
  );
};

export default DashBoardSC
