import React, { useState } from "react";
import { Layout, theme } from "antd";
import logo from "../assets/logo.png";
import MenuList from "./Menulist";
import THeader from "./header";
import Users from "./Usersfeatures/Users";
import Sales from "./Salesfeatures/Sales";
import ApproveUser from "./Usersfeatures/ApproveUser";
import Products from "./Productfeatures/Products";
import axios from "axios";
import "../Styles/HomePage.css";
import Customer from "./Customerfeatures/Customer";
import Supplier from "./Supplierfeatures/Supplier";
import Purchase from "./Purchasefeachers/Purchase";
import { useSelector, useDispatch } from "react-redux";
import { handleLogout } from "../Store/authSlice";
const { Sider, Content } = Layout;

const contents = {
  1: "Dashboard",
  3: <Users />,
  4: <ApproveUser />,
  6: <Products />,
  7: <Products />,
  8: <Customer />,
  10: <Sales />,
  11: <Sales />,
  12: <Sales />,
  13: <Supplier />,
  14: <Purchase />,
};

const HomePage = () => {
  const { collapsed, currentContent } = useSelector((state) => state.homeMenu);

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
