import React from "react";
import TechDashboard from "./techDashboard";
import DashBoardSM from "./DashBoardSM";
import DashBoardSC from "./DashBoardSC";
import { Layout } from "antd";
import { useSelector } from "react-redux";

const { Sider, Content } = Layout;

const DashboardWrapper = () => {
  const role = useSelector((state) => state.auth.role); // Assuming `role` is stored in `auth.role`

  // Determine the dashboard component based on the user role
  const renderDashboard = () => {
    switch (role) {
      case "secretary":
        return <DashBoardSC />;
      case "SalesMan":
        return <DashBoardSM />;
      case "technician":
        return <TechDashboard />;
      default:
        return <p>No dashboard available for this role.</p>;
    }
  };

  return (
    <Layout>
      <Sider>Sider Content (optional)</Sider>
      <Content>{renderDashboard()}</Content>
    </Layout>
  );
};

export default DashboardWrapper;
