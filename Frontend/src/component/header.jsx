import React, { useState } from 'react';
import userPhoto from '../assets/UserPhoto.jpg';
import './header.css'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Button,Layout,theme } from 'antd';
const { Header } = Layout;
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';



function THeader({ collapsed, setCollapsed ,onLogout, signedUser }) {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const handleLogout = () => {
    onLogout();
  };

  const toggleNotificationDropdown = () => setShowNotificationDropdown(!showNotificationDropdown);
  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown);
  const handleMouseOut = (e) => {
    e.target.value = "";
    e.target.blur();
  };


  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
        {/* Menu Toggle Button */}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
      
        {/* Navigation Bar */}
        <div className="header-right">
          {/* Search Bar */}
          <div className="box">
              <form name="search" className="d-flex">
                <input
                  type="text"
                  className="form-control me-2 input"
                  name="txt"
                  onMouseOut={handleMouseOut}
                  placeholder="Search..."
                />
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
              </form>
          </div>
      
          {/* Notification Bell */}
          <div >
            <button
              onClick={toggleNotificationDropdown}
              className="btn btn-light notification-bell"
              style={{ border: "none", background: "transparent" }}
            >
              <FontAwesomeIcon icon={faBell} className="bell-icon" />
            </button>
            {showNotificationDropdown && (
              <div className="dropdown-menu notification-dropdown show" style={{ position: "absolute", top: "100%" }}>
                <button className="dropdown-item">No new notifications</button>
              </div>
            )}
          </div>
      
          {/* User Profile */}
          <div className="user-profile">
            <img
              src={signedUser?.Photo || userPhoto}
              alt="User"
              className="rounded-circle user-photo"
              style={{ width: "40px", height: "40px", cursor: "pointer" }}
              onClick={toggleUserDropdown}
            />
            <span
              className="ms-2"
              onClick={toggleUserDropdown}
              style={{ cursor: "pointer" }}
            >
              {signedUser?.fName} {signedUser?.lName}
            </span>
            {showUserDropdown && (
              <div className="dropdown-menu user-dropdown show" style={{ position: "absolute", top: "100%" }}>
                <a href="" className="dropdown-item">Profile</a>
                <a href="" className="dropdown-item">Settings</a>
                <div className="dropdown-divider"></div>
                <a href=""
                 className="dropdown-item"
                 onClick={handleLogout}
                 >Logout</a>
              </div>
            )}
          </div>
        </div>
      </Header>
  );
}

export default THeader;


