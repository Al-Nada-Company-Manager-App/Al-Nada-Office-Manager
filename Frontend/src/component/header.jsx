import React, { useState } from "react";
import userPhoto from "../assets/UserPhoto.jpg";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import "../Styles/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell } from "@fortawesome/free-solid-svg-icons";
import { Button, Layout, theme } from "antd";
import UserDetails from "./Usersfeatures/UserDetails";
import ProductDetails from "./Productfeatures/ProductDetails";
import DebtDetails from "./Debtsfeatures/DebtsDetails";
import { handleLogout } from "../Store/authSlice";
import { toggleCollapsed } from "../Store/homeMenu";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotification,
  approveNotification,
  expireNotification,
  debtNotification,
  deleteNotification,
} from "../Store/Notification";
import { setUserModalVisible } from "../Store/Users";
import { setdetailProductModalVisible } from "../Store/Product";
import { setDebtModalVisible } from "../Store/Debts";
const { Header } = Layout;

function THeader() {
  const { collapsed } = useSelector((state) => state.homeMenu);
  const { SignedUser } = useSelector((state) => state.auth);
  const { selectedUser } = useSelector((state) => state.Users);
  const { selectedProduct } = useSelector((state) => state.Products);
  const { selectedDebt } = useSelector((state) => state.Debts);
  const { NotificationData } = useSelector((state) => state.Notification);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dispatch = useDispatch();

  const handletoggleCollapsed = () => {
    dispatch(toggleCollapsed());
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const Logout = () => {
    dispatch(handleLogout());
  };
  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
  };
  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown);
  const handleMouseOut = (e) => {
    e.target.value = "";
    e.target.blur();
  };

  React.useEffect(() => {
    dispatch(fetchNotification());
  }, []);

  const handleNotification = async (Notification) => {
    if(Notification.n_type === "APPROVEUSER"){
   await  dispatch(approveNotification(Notification.e_id));
    dispatch(setUserModalVisible(true));
    }else if(Notification.n_type === "Product Expiry"){
     await dispatch(expireNotification(Notification.p_id));
      dispatch(setdetailProductModalVisible(true));
    }
    else if(Notification.n_type === "Debt Due Date"){
      await dispatch(debtNotification(Notification.d_id));
      dispatch(setDebtModalVisible(true));
    }

    const ids ={n_id:Notification.n_id,
      e_id: SignedUser.id
    }

    await dispatch(deleteNotification(ids));
    dispatch(fetchNotification());
  };

  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      {/* Menu Toggle Button */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => handletoggleCollapsed()}
        style={{
          fontSize: "16px",
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
        <div style={{ position: "relative" }}>
          <button
            onClick={toggleNotificationDropdown}
            className="btn btn-light notification-bell"
            style={{ border: "none", background: "transparent" }}
          >
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
          </button>
          {showNotificationDropdown && (
            <div
              className="dropdown-menu notification-dropdown show"
              style={{ position: "absolute", top: "100%" }}
            >
              {NotificationData.length > 0 ? (
                NotificationData.map((notification, index) => (
                  <button
                    key={index}
                    onClick={() => handleNotification(notification)}
                    className="dropdown-item"
                  >
                    {notification.n_message}
                  </button>
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
            src={SignedUser?.Photo || userPhoto}
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
            {SignedUser?.fName} {SignedUser?.lName}
          </span>
          {showUserDropdown && (
            <div
              className="dropdown-menu user-dropdown show"
              style={{ position: "absolute", top: "100%" }}
            >
              <a href="" className="dropdown-item">
                Profile
              </a>
              <a href="" className="dropdown-item">
                Settings
              </a>
              <div className="dropdown-divider"></div>
              <a href="" className="dropdown-item" onClick={Logout}>
                Logout
              </a>
            </div>
          )}
        </div>
        {selectedUser && <UserDetails />}
        {selectedProduct && <ProductDetails />}
        {selectedDebt && <DebtDetails />}

      </div>
    </Header>
  );
}

export default THeader;
