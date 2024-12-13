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
import { useDispatch } from "react-redux";
import { setCurrentContent } from "../Store/homeMenu";

const MenuList = () => {
  const dispatch = useDispatch();

  const handleMenuClick = (contentId) => {
    dispatch(setCurrentContent(contentId));
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["1"]}
      className="menu-list"
      items={[
        {
          key: "1",
          icon: <DashboardOutlined />,
          label: "Dashboard",
          onClick: () => handleMenuClick("1"),
        },
        {
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
        {
          key: "5",
          icon: <UploadOutlined />,
          label: "Stock",
          children: [
            {
              key: "6",
              label: "Products",
              onClick: () => handleMenuClick("6"),
            },
            {
              key: "7",
              label: "Products are repairing",
              onClick: () => handleMenuClick("7"),
            },
          ],
        },
        {
          key: "8",
          icon: <UserOutlined />,
          label: "Customer",
          onClick: () => handleMenuClick("8"),
        },
        {
          key: "9",
          icon: <CashCoin />,
          label: "Sales Management",
          children: [
            {
              key: "10",
              label: "Sales",
              onClick: () => handleMenuClick("10"),
            },
            {
              key: "11",
              label: "Price Quatation",
              onClick: () => handleMenuClick("11"),
            },
            {
              key: "12",
              label: "Debts",
              onClick: () => handleMenuClick("12"),
            },
          ],
        },
        {
          key: "13",
          icon: <UserOutlined/>,
          label: "Supplier",
          onClick: () => handleMenuClick("13"),        },
        {
          key: "14",
          icon: <PayCircleOutlined />,
          label: "Purchase Items",
          onClick: () => handleMenuClick("14"),        },
        {
          key: "15",
          icon: <SettingOutlined />,
          label: "Setting",
        },
      ]}
    />
  );
};

export default MenuList;
