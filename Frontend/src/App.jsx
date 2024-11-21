import React, { useState } from 'react';

import { Button, Layout, theme } from 'antd';
import logo from './assets/logo.png';
import MenuList from './component/Menulist';
import THeader from './component/header';
import './App.css';

const {Sider, Content } = Layout;

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} className='sidebar'>
            <div className="logo" >
                <img src={logo} alt="Logo" className="logo-img"  />
            </div>
            <MenuList />
        </Sider>
        <Layout>
            <THeader collapsed={collapsed} setCollapsed={setCollapsed} />
            <Content
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
            >
            Content
            </Content>
        </Layout>
        </Layout>
    );
};

export default App;