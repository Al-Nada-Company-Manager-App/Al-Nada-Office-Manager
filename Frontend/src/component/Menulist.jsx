import React from "react";
import {
  PayCircleOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { CashCoin } from "react-bootstrap-icons";
import "../Styles/Menulist.css";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentContent } from "../Store/homeMenu";

const MenuList = () => {
  const dispatch = useDispatch();
  const { userAccess } = useSelector((state) => state.auth);

  const handleMenuClick = (contentId) => {
    dispatch(setCurrentContent(contentId));
  };
 
  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => handleMenuClick("1"),
    },
    userAccess && userAccess.users_page && {
      key: "2",
      icon: <UserOutlined />,
      label: "Users Management",
      children: [
        {
          key: "3",
          label: "Users",
          onClick: () => handleMenuClick("3"),
        },
        {
          key: "4",
          label: "Approve User",
          onClick: () => handleMenuClick("4"),
        },
      ],
    },
    ((userAccess && userAccess.products_page) || (userAccess && userAccess.repaire_page)) &&
    {
      key: "5",
      icon: <UploadOutlined />,
      label: "Stock",
      children: [
        userAccess && userAccess.products_page && 
        {
          key: "6",
          label: "Products",
          onClick: () => handleMenuClick("6"),
        },
        userAccess && userAccess.repaire_page &&
        {
          key: "7",
          label: "Products are repairing",
          onClick: () => handleMenuClick("7"),
        },
      ],
    },
    userAccess && userAccess.customer_page &&
    {
      key: "8",
      icon: <UserOutlined />,
      label: "Customer",
      onClick: () => handleMenuClick("8"),
    },
    ((userAccess && userAccess.sales_page) || (userAccess && userAccess.price_page) || (userAccess && userAccess.debts_page)) &&
    {
      key: "9",
      icon: <CashCoin />,
      label: "Sales Management",
      children: [
        userAccess && userAccess.sales_page &&
        {
          key: "10",
          label: "Sales",
          onClick: () => handleMenuClick("10"),
        },
        userAccess && userAccess.price_page &&
        {
          key: "11",
          label: "Price Quotation",
          onClick: () => handleMenuClick("11"),
        },
        userAccess && userAccess.debts_page &&
        {
          key: "12",
          label: "Debts",
          onClick: () => handleMenuClick("12"),
        },
      ],
    },
    userAccess && userAccess.supplier_page &&
    {
      key: "13",
      icon: <UserOutlined />,
      label: "Supplier",
      onClick: () => handleMenuClick("13"),
    },
    userAccess && userAccess.purchase_page &&
    {
      key: "14",
      icon: <PayCircleOutlined />,
      label: "Purchase Items",
      onClick: () => handleMenuClick("14"),
    },
  ];

  return (
    <Menu
      style={{backgroundColor: "#02001B"}}
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["1"]}
      className="menu-list"
      items = {menuItems}
    />
  );
};

export default MenuList;
