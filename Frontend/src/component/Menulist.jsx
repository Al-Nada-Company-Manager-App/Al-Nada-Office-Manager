import React from "react";
import {
    PayCircleOutlined,
    SettingOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
import {Menu} from 'antd';
import './Menulist.css';

const MenuList  =() =>{
    return (
        <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        className="menu-list"
        items={[
            {
            key: '1',
            icon: <UserOutlined />,
            label: 'Home',
            },
            {
            key: '2',
            icon: <VideoCameraOutlined />,
            label: 'Dashboard',
            },
            {
            key: '3',
            icon: <UploadOutlined />,
            label: 'Stock',
            },
            {
            key: '4',
            icon: <PayCircleOutlined />,
            label: 'Payment',
            },
            {
            key: '5',
            icon: <SettingOutlined />,
            label: 'Setting',
            }
        ]}
        />
    )

}
export default MenuList