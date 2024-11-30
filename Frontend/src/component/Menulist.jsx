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
import './Menulist.css';

// eslint-disable-next-line react/prop-types
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
            key: '7',
            icon: <UploadOutlined />,
            label: 'Stock',
            children: [
              { key: '8', label: 'Products' 
                , onClick: () => setCurrentContent('8')},
                { key: '9', label: 'Products are repairing' 
                , onClick: () => setCurrentContent('9'),
                },
            ],
            },
            {
            key: '10',
            icon: <PayCircleOutlined />,
            label: 'Payment',
            },
            {
            key: '11',
            icon: <SettingOutlined />,
            label: 'Setting',
            }
        ]}
        />
    )

}
export default MenuList