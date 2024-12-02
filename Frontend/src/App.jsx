import React, { useState } from 'react';
import { Button, Layout, theme } from 'antd';
import logo from './assets/logo.png';
import MenuList from './component/Menulist';
import THeader from './component/header';
import Users from './component/Users';
import Sales from './component/Sales';
import Purchase from './component/Purchase';
import ApproveUser from './component/ApproveUser';
import axios from 'axios';
import './App.css';
import Customer from './component/Customer';

const {Sider, Content } = Layout;
const getSignedUser = async () => {
    
    const response = await axios.get('http://localhost:4000/SignedUser');
    return response.data;
}
const App = ({ onLogout }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [currentContent, setCurrentContent] = useState('1');
    const {
        token: { colorBgContainer, borderRadiusLG,contentBg
        },
    } = theme.useToken();
    const [signedUser, setSignedUser] = useState(null);
    React.useEffect(() => {
        getSignedUser().then((data) => {
            setSignedUser(data);
        });
    }, []);

    return (
        <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} className='sidebar'>
            <div className="logo">
                <img
                src={logo}
                alt="Logo"
                className={`logo-img ${collapsed ? 'collapsed-logo' : ''}`}
                />
            </div>
            <MenuList setCurrentContent={setCurrentContent} />
        </Sider>
        <Layout>
            <THeader 
            collapsed={collapsed} 
            setCollapsed={setCollapsed} 
            onLogout={onLogout}
            signedUser={signedUser}
            />
            <Content
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: contentBg,
                borderRadius: borderRadiusLG,
            }}
            >
                {currentContent === '3' && <Users />}
                {currentContent === '4' && <ApproveUser />}
                {currentContent === '9' && <Sales />}
                {currentContent === '22' && <Customer />}

                {currentContent === '12' && <Purchase />}

            </Content>
        </Layout>
        </Layout>
    );
};

export default App;
