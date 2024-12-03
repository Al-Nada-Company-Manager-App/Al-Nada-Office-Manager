/* eslint-disable no-unused-vars */
import React from "react";
import {
    PayCircleOutlined,
    SettingOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    DashboardOutlined,
  } from '@ant-design/icons';
import {Menu} from 'antd';
import { CashCoin } from 'react-bootstrap-icons';
import './Menulist.css';

const MenuList  =({setCurrentContent}) => {
    return (
        <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        className="menu-list"
        items={[
            {
            key: '1',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => setCurrentContent('1'),
            },
            {
            key: '2',
            icon: <UserOutlined />,
            label: 'Users Management',
            children: [
                { key: '3', label: 'Users' 
                , onClick: () => setCurrentContent('3')},
                { key: '4', label: 'Approve User' 
                , onClick: () => setCurrentContent('4'),
                },
              ],
            },
            {
            key: '5',
            icon: <UploadOutlined />,
            label: 'Stock',
            children: [
              { key: '6', label: 'Products' 
                , onClick: () => setCurrentContent('8')},
                { key: '7', label: 'Products are repairing' 
                , onClick: () => setCurrentContent('9'),
                },
            ],
            },
            {
            key: '8',
            icon: <UserOutlined />,
            label: 'Customer',
            onClick: () => setCurrentContent('22'),
            },
            {
              key: '9',
              icon: <CashCoin />,
              label: 'Sales Management',
              children: [
                  { key: '10', label: 'Sales' 
                  , onClick: () => setCurrentContent('9')},
                  { key: '11', label: 'Price Quatation' 
                  , onClick: () => setCurrentContent('10'),
                  },
                  { key: '12', label: 'Debts',
                    onClick: () => setCurrentContent('11')
                  },
                ],
            },
            {
            key: '13',
            icon: <PayCircleOutlined />,
            label: 'Payment',
            },
            {
            key: '14',
            icon: <SettingOutlined />,
            label: 'Setting',
            },
        ]}
        />
    )

}
export default MenuList