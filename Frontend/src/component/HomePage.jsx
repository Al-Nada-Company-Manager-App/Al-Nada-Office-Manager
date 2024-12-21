import React, { useState } from "react";
import { Layout, theme } from "antd";
import logo from "../assets/logo.png";
import MenuList from "./Menulist";
import THeader from "./header";
import Users from "./Usersfeatures/Users";
import Sales from "./Salesfeatures/Sales";
import ApproveUser from "./Usersfeatures/ApproveUser";
import Products from "./Productfeatures/Products";
import Debts from "./Debtsfeatures/Debts";
import RepairProducts from "./RepairProductfeatures/RepairProducts";
import axios from "axios";
import "../Styles/HomePage.css";
import Customer from "./Customerfeatures/Customer";
import PriceQuotation from "./PriceQoutationfeatures/PriceQuotation";
import Supplier from "./Supplierfeatures/Supplier";
import Purchase from "./Purchasefeachers/Purchase";
import DashboardACT from "./Dashboardfeatures/DashboardACT";
import { useSelector, useDispatch } from "react-redux";
import DashboardMG from './Dashboardfeatures/DashboardMG';
import UserProfile from "./UserProfilefeatures/UserProfile";
import DashBoardSM from "./Dashboardfeatures/DashBoardSM";
import DashboardTCH from "./Dashboardfeatures/DashboardTCH";
import DashBoardSC from "./Dashboardfeatures/DashBoardSC";
const { Sider, Content } = Layout;


const HomePage = () => {
  const { collapsed, currentContent } = useSelector((state) => state.homeMenu);
  const { SignedUser } = useSelector((state) => state.auth);
  React.useEffect(() => {console.log(SignedUser)},[SignedUser]);
  const dashboards={
    "Manager":<DashboardMG />,
    "Technical Support":<DashboardTCH />,
    "SalesMan":<DashBoardSM />,
    "Secartary": <DashBoardSC />, 
    "Accountant":<DashboardACT/>,
  };
  const contents = {
    1: (SignedUser && dashboards[SignedUser.Role]) || "DefaultDashboard",
    3: <Users />,
    4: <ApproveUser />,
    6: <Products />,
    7: <RepairProducts />,
    8: <Customer />,
    10: <Sales />,
    11: <PriceQuotation />,
    12: <Debts />,
    13: <Supplier />,
    14: <Purchase />,
    20: <UserProfile />,
  };
  const {
    token: { colorBgContainer, borderRadiusLG, contentBg },
  } = theme.useToken();

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sidebar"
      >
        <div className="logo">
          <img
            src={logo}
            alt="Logo"
            className={`logo-img ${collapsed ? "collapsed-logo" : ""}`}
          />
        </div>
        <MenuList />
      </Sider>
      <Layout>
        <THeader />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: contentBg,
            borderRadius: borderRadiusLG,
          }}
        >
          {contents[currentContent] || <Users />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomePage;
