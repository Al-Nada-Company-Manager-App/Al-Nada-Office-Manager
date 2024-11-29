import React, { useState } from 'react';
import userPhoto from '../assets/UserPhoto.jpg';
import './header.css'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Button,Layout,theme } from 'antd';
import axios from 'axios';
import UserDetails from './Usersfeatures/UserDetails';

const { Header } = Layout;
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const fetchNotifications = async () => {
  try {
    const response = await axios.get('http://localhost:4000/notificaions');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
}



function THeader({ collapsed, setCollapsed ,onLogout, signedUser }) {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [getNotifications, setNotifications] = useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };
   
  const handleDeleteUser = (id) => async () => {
    try {
        const response = await axios.post('http://localhost:4000/deleteUser', { id }, { withCredentials: true });
        fetchUsers().then((data) => {
            setUsersData(data);
        });
      handleModalClose();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  const handleactivateUser = (id) => async () => {
    try {
    const response = await axios.post('http://localhost:4000/activateUser', { id }, { withCredentials: true });
        fetchUsers().then((data) => {
            setUsersData(data);
        });
        handleModalClose();
    } catch (error) {
      console.error('Error activating user:', error);
    }
  }
  const handledeactivateUser = (id) => async () => {
        try {
        const response = await axios.post('http://localhost:4000/deactivateUser', { id }, { withCredentials: true });
        fetchUsers().then((data) => {
            setUsersData(data);
        });
        handleModalClose();
        } catch (error) {
        console.error('Error deactivating user:', error);
        }
  }


  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const handleLogout = () => {
    onLogout();
  };

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown)
  };
  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown);
  const handleMouseOut = (e) => {
    e.target.value = "";
    e.target.blur();
  };

  React.useEffect(() => {
    fetchNotifications().then((data) => {
      setNotifications(data);
    });
  }, []);

  const handleNotification = async (Notification) => {
    const result = await axios.get(`http://localhost:4000/getemployeebyid`,{
      params: { e_id: Notification.e_id },
      withCredentials: true,
    });
    setSelectedUser(result.data);
    setIsModalVisible(true);
    await axios.post('http://localhost:4000/deleteNotification', {
      n_id: Notification.n_id 
  }, {
      withCredentials: true
  });
    fetchNotifications().then((data) => {
      setNotifications(data);
    });
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
          <div style={{ position: 'relative' }} >
            <button
              onClick={toggleNotificationDropdown}
              className="btn btn-light notification-bell"
              style={{ border: "none", background: "transparent" }}
            >
              <FontAwesomeIcon icon={faBell} className="bell-icon" />
            </button>
            {showNotificationDropdown && (
              <div className="dropdown-menu notification-dropdown show" style={{ position: "absolute", top: "100%" }}>
                {getNotifications.length > 0 ? (
                  getNotifications.map((notification, index) => (
                    <button key={index} 
                    onClick={() => handleNotification(notification)}
                     className="dropdown-item">{notification.n_message}</button>
                  ))
                ) : (
                  <button className="dropdown-item">No new notifications</button>
                )} 
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
          {selectedUser&&
            <UserDetails
              selectedUser={selectedUser}
              isModalVisible={isModalVisible}
              handleModalClose={handleModalClose}
              handleDeleteUser={handleDeleteUser}
              handledeactivateUser={handledeactivateUser}
              handleactivateUser={handleactivateUser}
          />
          }
        </div>
      </Header>
  );
}

export default THeader;


