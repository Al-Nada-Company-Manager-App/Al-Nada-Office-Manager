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
            key: '7',
            icon: <UploadOutlined />,
            label: 'Stock',
            },
            {
              key: '8',
              icon: <CashCoin />,
              label: 'Sales Management',
              children: [
                  { key: '9', label: 'Sales' 
                  , onClick: () => setCurrentContent('9')},
                  { key: '10', label: 'Price Quatation' 
                  , onClick: () => setCurrentContent('10'),
                  },
                  { key: '11', label: 'Debts',
                    onClick: () => setCurrentContent('11')
                  },
                ],
            },
            {
            key: '12',
            icon: <PayCircleOutlined />,
            label: 'Purchase Items',
            onClick: () => setCurrentContent('12'),
            },
            {
            key: '13',
            icon: <SettingOutlined />,
            label: 'Setting',
            }
        ]}
        />
    )

}
export default MenuList